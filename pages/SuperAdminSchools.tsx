import React, { useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { createUserWithDefaultPassword } from '../services/users';
import { useCollection } from '../hooks/useCollection';
import { updateRecord } from '../services/firestore';
import { sendNotificationNow } from '../services/notifications';
import { useToast } from '../components/ToastProvider';

interface SchoolRecord {
  id: string;
  name: string;
  code: string;
  city: string;
  board: string;
  adminEmail?: string;
  adminUid?: string;
  createdAt?: string;
  locks?: {
    users?: boolean;
    academics?: boolean;
    transport?: boolean;
    finance?: boolean;
  };
}

const SuperAdminSchools: React.FC = () => {
  const { push } = useToast();
  const [schoolName, setSchoolName] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [city, setCity] = useState('');
  const [board, setBoard] = useState('CBSE');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<SchoolRecord>>({});
  const [notifyStatus, setNotifyStatus] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: schools } = useCollection<SchoolRecord>('schools', { orderBy: 'createdAt', limit: 50 });

  const totalSchools = schools.length;
  const lockedUsers = schools.filter((s) => s.locks?.users).length;
  const lockedFinance = schools.filter((s) => s.locks?.finance).length;
  const pendingAdmins = schools.filter((s) => !s.adminEmail).length;

  const withTimeout = async <T,>(promise: Promise<T>, ms = 15000) => {
    let timer: ReturnType<typeof setTimeout>;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('Request timed out. Please try again.')), ms);
    });
    try {
      return await Promise.race([promise, timeout]);
    } finally {
      clearTimeout(timer!);
    }
  };

  const formatCreatedAt = (value: any) => {
    if (!value) return 'Created date n/a';
    if (typeof value === 'string') return new Date(value).toLocaleDateString();
    if (value?.seconds) return new Date(value.seconds * 1000).toLocaleDateString();
    return 'Created date n/a';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);
    try {
      const schoolRef = await withTimeout(addDoc(collection(db, 'schools'), {
        name: schoolName,
        code: schoolCode,
        city,
        board,
        locks: { users: false, academics: false, transport: false, finance: false },
        createdAt: new Date().toISOString(),
      }));

      const result: any = await withTimeout(createUserWithDefaultPassword({
        name: adminName,
        email: adminEmail,
        role: 'admin',
        schoolId: schoolRef.id,
      }));

      const adminUid = result?.data?.uid;
      if (adminUid) {
        await withTimeout(updateDoc(doc(db, 'schools', schoolRef.id), {
          adminUid,
          adminEmail,
        }));
      }

      setStatus('School created. Admin user created with default password qwe123.');
      push({ type: 'success', title: 'School created', message: 'Admin created with default password qwe123.' });
      setSchoolName('');
      setSchoolCode('');
      setCity('');
      setBoard('CBSE');
      setAdminName('');
      setAdminEmail('');
    } catch (err: any) {
      setStatus(err?.message ?? 'Failed to create school. Try again.');
      push({ type: 'error', title: 'School creation failed', message: err?.message ?? 'Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (item: SchoolRecord) => {
    setEditingId(item.id);
    setDraft(item);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updateRecord('schools', editingId, {
      name: draft.name,
      code: draft.code,
      city: draft.city,
      board: draft.board,
      adminEmail: draft.adminEmail,
    });
    cancelEdit();
  };

  const toggleLock = async (school: SchoolRecord, key: 'users' | 'academics' | 'transport' | 'finance') => {
    const locks = { ...school.locks, [key]: !school.locks?.[key] };
    await updateRecord('schools', school.id, { locks });
  };

  const sendPaymentCompletion = async (school: SchoolRecord) => {
    setNotifyStatus(null);
    try {
      await sendNotificationNow({
        title: `Payment Completed · ${school.name}`,
        message: `Payment has been completed for ${school.name}. Your Schools24 services are now active.`,
        channel: 'Email',
        audience: 'Parents',
      });
      setNotifyStatus('Payment completion notification sent.');
      push({ type: 'success', title: 'Notification sent', message: `Payment completion sent for ${school.name}.` });
    } catch (err: any) {
      setNotifyStatus(err?.message ?? 'Failed to send notification.');
      push({ type: 'error', title: 'Notification failed', message: err?.message ?? 'Please try again.' });
    }
  };

  return (
    <DashboardShell title="School Provisioning" role="Super Admin" homePath="/dashboard/super-admin">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Schools', value: totalSchools },
          { label: 'Pending Admins', value: pendingAdmins },
          { label: 'Users Locked', value: lockedUsers },
          { label: 'Finance Locked', value: lockedFinance },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-5">
            <div className="text-xs text-[var(--dash-muted)]">{stat.label}</div>
            <div className="mt-2 text-2xl font-semibold">{stat.value}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Create School + Assign Admin</h2>
            <span className="text-xs text-[var(--dash-muted)]">Default password: qwe123</span>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="School Name"
              className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              required
            />
            <input
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value)}
              placeholder="School Code"
              className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              required
            />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              required
            />
            <select
              value={board}
              onChange={(e) => setBoard(e.target.value)}
              className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
            >
              <option>CBSE</option>
              <option>ICSE</option>
              <option>IB</option>
              <option>State Board</option>
            </select>
            <input
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="Admin Name"
              className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              required
            />
            <input
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="Admin Email"
              type="email"
              className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              required
            />
            <button
              type="submit"
              disabled={isSaving}
              className={`md:col-span-2 rounded-xl py-2.5 text-sm font-semibold text-black ${isSaving ? 'bg-[var(--dash-card)] opacity-70 cursor-not-allowed' : 'bg-[var(--dash-accent)]'}`}
            >
              {isSaving ? 'Creating...' : 'Create School'}
            </button>
          </form>
          {status && (
            <div
              className={`mt-4 text-xs ${status.toLowerCase().includes('failed') || status.toLowerCase().includes('timeout')
                ? 'text-red-400'
                : 'text-emerald-400'
                }`}
            >
              {status}
            </div>
          )}
          {notifyStatus && <div className="mt-2 text-xs text-[var(--dash-muted)]">{notifyStatus}</div>}
        </div>

        <div className="rounded-3xl border border-[var(--dash-border)] bg-gradient-to-br from-[var(--dash-card)] to-transparent p-6">
          <h3 className="text-lg font-semibold">Controls</h3>
          <p className="text-sm text-[var(--dash-muted)] mt-2">Lock or unlock modules per school. Send payment completion alerts.</p>
          <div className="mt-6 space-y-3">
            {['Users', 'Academics', 'Transport', 'Finance'].map((label) => (
              <div key={label} className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-3 text-sm">
                {label} Lock
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">School Directory</h2>
          <span className="text-xs text-[var(--dash-muted)]">{schools.length} schools</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {schools.map((school) => (
            <div
              key={school.id}
              className={`relative overflow-hidden rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-card)] p-5 transition hover:shadow-lg cursor-pointer ${expandedId === school.id ? 'ring-1 ring-[var(--dash-accent)]' : ''}`}
              onClick={() => (editingId === school.id ? null : setExpandedId(expandedId === school.id ? null : school.id))}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-1"
                style={{ background: 'linear-gradient(90deg, var(--dash-accent) 0%, transparent 70%)' }}
              />
              {editingId === school.id ? (
                <div className="grid gap-3">
                  <input
                    value={draft.name ?? ''}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.code ?? ''}
                    onChange={(e) => setDraft({ ...draft, code: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.city ?? ''}
                    onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.board ?? ''}
                    onChange={(e) => setDraft({ ...draft, board: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.adminEmail ?? ''}
                    onChange={(e) => setDraft({ ...draft, adminEmail: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={(e) => { e.stopPropagation(); saveEdit(); }} className="rounded-lg bg-[var(--dash-accent)] px-4 py-2 text-xs font-semibold text-black">Save</button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); cancelEdit(); }} className="rounded-lg border border-[var(--dash-border)] px-4 py-2 text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-xs text-[var(--dash-muted)]">{school.code} · {school.city} · {formatCreatedAt(school.createdAt)}</div>
                  <div className="text-lg font-semibold mt-1">{school.name}</div>
                  <div className="text-xs text-[var(--dash-muted)] mt-2">Board: {school.board}</div>
                  <div className="text-xs text-[var(--dash-muted)]">Admin: {school.adminEmail ?? 'Unassigned'}</div>
                  <div className="mt-2 text-xs text-[var(--dash-muted)]">{expandedId === school.id ? 'Hide details' : 'View details'}</div>
                  {school.adminUid && <div className="text-xs text-[var(--dash-muted)]">Admin UID: {school.adminUid}</div>}
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase">
                    {[
                      { label: 'Users', value: school.locks?.users },
                      { label: 'Academics', value: school.locks?.academics },
                      { label: 'Transport', value: school.locks?.transport },
                      { label: 'Finance', value: school.locks?.finance },
                    ].map((lock) => (
                      <span
                        key={lock.label}
                        className={`rounded-full px-2 py-1 border border-[var(--dash-border)] ${lock.value ? 'bg-red-500/10 text-red-300' : 'bg-emerald-500/10 text-emerald-300'}`}
                      >
                        {lock.label} {lock.value ? 'Locked' : 'Open'}
                      </span>
                    ))}
                  </div>
                  {expandedId === school.id && (
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <button type="button" onClick={(e) => { e.stopPropagation(); startEdit(school); }} className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-xs font-semibold">
                        Edit School Details
                      </button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); sendPaymentCompletion(school); }} className="rounded-lg bg-[var(--dash-accent)] px-4 py-2 text-xs font-semibold text-black">
                        Send Payment Complete
                      </button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); toggleLock(school, 'users'); }} className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-xs">
                        Users {school.locks?.users ? 'Locked' : 'Open'}
                      </button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); toggleLock(school, 'academics'); }} className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-xs">
                        Academics {school.locks?.academics ? 'Locked' : 'Open'}
                      </button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); toggleLock(school, 'transport'); }} className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-xs">
                        Transport {school.locks?.transport ? 'Locked' : 'Open'}
                      </button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); toggleLock(school, 'finance'); }} className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-xs">
                        Finance {school.locks?.finance ? 'Locked' : 'Open'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          {schools.length === 0 && <div className="text-[var(--dash-muted)]">No schools created yet.</div>}
        </div>
      </section>
    </DashboardShell>
  );
};

export default SuperAdminSchools;
