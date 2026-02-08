import React, { useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import { useAuth } from '../contexts/AuthContext';
import { useSchoolLocks } from '../hooks/useSchoolLocks';
import LockBanner from '../components/LockBanner';
import { createAdmissionApplication, deleteRecord, updateAdmissionStatus, updateRecord } from '../services/firestore';
import { useCollection } from '../hooks/useCollection';
import { useToast } from '../components/ToastProvider';

interface AdmissionRecord {
  id: string;
  schoolName: string;
  city: string;
  board: string;
  contactName: string;
  email: string;
  status: string;
}

const Admissions: React.FC = () => {
  const { profile } = useAuth();
  const isSuperAdmin = profile?.role === 'super_admin';
  const { push } = useToast();
  const { locks } = useSchoolLocks();
  const isLocked = !isSuperAdmin && Boolean(locks.academics);
  const [schoolName, setSchoolName] = useState('');
  const [city, setCity] = useState('');
  const [board, setBoard] = useState('CBSE');
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('Principal');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<AdmissionRecord>>({});

  const { data: admissions, loading } = useCollection<AdmissionRecord>('admissions', { orderBy: 'createdAt', limit: 10 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setIsSaving(true);
    try {
      await createAdmissionApplication({ schoolName, city, board, contactName, contactRole, email });
      push({ type: 'success', title: 'Application created', message: 'Admission record saved.' });
    } catch (err: any) {
      push({ type: 'error', title: 'Create failed', message: err?.message ?? 'Please try again.' });
    }
    setSchoolName('');
    setCity('');
    setContactName('');
    setEmail('');
    setIsSaving(false);
  };

  const handleStatus = async (id: string, status: string) => {
    if (isLocked) return;
    await updateAdmissionStatus(id, status);
  };

  const handleDelete = async (id: string) => {
    if (isLocked) return;
    await deleteRecord('admissions', id);
  };

  const startEdit = (item: AdmissionRecord) => {
    if (isLocked) return;
    setEditingId(item.id);
    setDraft(item);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = async () => {
    if (!editingId || isLocked) return;
    const { schoolName: name, city: cty, board: brd, contactName: contact, email: eml, status } = draft;
    await updateRecord('admissions', editingId, {
      schoolName: name,
      city: cty,
      board: brd,
      contactName: contact,
      email: eml,
      status,
    });
    cancelEdit();
  };

  return (
    <DashboardShell title="Admissions Pipeline" role="Admin" homePath="/dashboard/admin">
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">New Application</h2>
          {isLocked && (
            <div className="mt-4">
              <LockBanner
                title="Academics module is locked"
                description="Admissions workflow is disabled until the lock is removed by the super admin."
              />
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="School Name"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              required
              disabled={isLocked}
            />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              required
              disabled={isLocked}
            />
            <select
              value={board}
              onChange={(e) => setBoard(e.target.value)}
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              disabled={isLocked}
            >
              <option>CBSE</option>
              <option>ICSE</option>
              <option>IB</option>
              <option>State Board</option>
            </select>
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Contact Name"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              required
              disabled={isLocked}
            />
            <input
              value={contactRole}
              onChange={(e) => setContactRole(e.target.value)}
              placeholder="Contact Role"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              required
              disabled={isLocked}
            />
            <button
              type="submit"
              disabled={isSaving || isLocked}
              className={`md:col-span-2 rounded-lg py-2.5 text-sm font-semibold text-black ${isLocked ? 'bg-[var(--dash-card)] opacity-60 cursor-not-allowed' : 'bg-[var(--dash-accent)]'}`}
            >
              {isSaving ? 'Saving...' : 'Submit Application'}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Pipeline Summary</h2>
          <div className="mt-6 space-y-3">
            {['New', 'Qualified', 'Onboarding', 'Live'].map((stage) => (
              <div key={stage} className="flex items-center justify-between rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3">
                <span className="text-sm">{stage}</span>
                <span className="text-sm text-[var(--dash-accent)]">{Math.floor(Math.random() * 12) + 4}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
        <h2 className="text-lg font-semibold">Recent Applications</h2>
        <div className="mt-6 space-y-3 text-sm">
          {loading && <div className="text-[var(--dash-muted)]">Loading...</div>}
          {!loading && admissions.length === 0 && (
            <div className="text-[var(--dash-muted)]">No applications yet.</div>
          )}
          {admissions.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3">
              {editingId === item.id ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={draft.schoolName ?? ''}
                    onChange={(e) => setDraft({ ...draft, schoolName: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.city ?? ''}
                    onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.board ?? ''}
                    onChange={(e) => setDraft({ ...draft, board: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.contactName ?? ''}
                    onChange={(e) => setDraft({ ...draft, contactName: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.email ?? ''}
                    onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.status ?? ''}
                    onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <div className="flex gap-2 md:col-span-2">
                    <button type="button" onClick={saveEdit} className="rounded-lg bg-[var(--dash-accent)] px-4 py-2 text-xs font-semibold text-black">
                      Save
                    </button>
                    <button type="button" onClick={cancelEdit} className="rounded-lg border border-[var(--dash-border)] px-4 py-2 text-xs">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{item.schoolName}</div>
                      <div className="text-xs text-[var(--dash-muted)]">{item.city} · {item.board} · {item.contactName}</div>
                    </div>
                    <span className="text-xs rounded-full border border-[var(--dash-border)] px-3 py-1 text-[var(--dash-muted)]">{item.status}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatus(item.id, 'Qualified')}
                      className="text-xs text-[var(--dash-accent)]"
                    >
                      Qualify
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatus(item.id, 'Rejected')}
                      className="text-xs text-red-400"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="text-xs text-[var(--dash-accent)]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-xs text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
};

export default Admissions;
