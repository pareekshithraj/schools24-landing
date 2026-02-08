import React, { useEffect, useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import { deleteRecord, updateRecord } from '../services/firestore';
import { useCollection } from '../hooks/useCollection';
import { UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { createUserWithDefaultPassword } from '../services/users';
import { useSchoolLocks } from '../hooks/useSchoolLocks';
import LockBanner from '../components/LockBanner';
import { useToast } from '../components/ToastProvider';

interface UserRecord {
  id: string;
  displayName?: string;
  email?: string;
  role?: string;
  schoolId?: string;
}

const Users: React.FC = () => {
  const { profile } = useAuth();
  const isSuperAdmin = profile?.role === 'super_admin';
  const { push } = useToast();
  const { locks } = useSchoolLocks();
  const isLocked = !isSuperAdmin && Boolean(locks.users);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('teacher');
  const [schoolId, setSchoolId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<UserRecord>>({});
  const [status, setStatus] = useState<string | null>(null);

  const { data: users } = useCollection<UserRecord>('users', { orderBy: 'createdAt', limit: 20 });

  useEffect(() => {
    if (!isSuperAdmin && profile?.schoolId) {
      setSchoolId(profile.schoolId);
    }
  }, [isSuperAdmin, profile?.schoolId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setIsSaving(true);
    setStatus(null);
    try {
      await createUserWithDefaultPassword({ name, email, role, schoolId });
      setStatus(`User created. Default password is qwe123.`);
      push({ type: 'success', title: 'User created', message: 'Default password is qwe123.' });
      setName('');
      setEmail('');
      setSchoolId('');
    } catch (err: any) {
      push({ type: 'error', title: 'User creation failed', message: err?.message ?? 'Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteRecord('users', id);
  };

  const startEdit = (item: UserRecord) => {
    setEditingId(item.id);
    setDraft(item);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = async () => {
    if (!editingId || isLocked) return;
    await updateRecord('users', editingId, {
      displayName: draft.displayName,
      email: draft.email,
      role: draft.role,
      schoolId: draft.schoolId,
    });
    cancelEdit();
  };

  return (
    <DashboardShell title="User Management" role="Admin" homePath="/dashboard/admin">
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Create User</h2>
          <p className="text-sm text-[var(--dash-muted)] mt-2">Default password will be set to qwe123.</p>
          {isLocked && (
            <div className="mt-4">
              <LockBanner
                title="User provisioning is locked"
                description="Your Schools24 super admin has temporarily locked user creation for this school."
              />
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              required
              disabled={isLocked}
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
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              disabled={isLocked}
            >
              <option value="admin">Admin</option>
              {isSuperAdmin && <option value="super_admin">Super Admin</option>}
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="driver">Driver</option>
              <option value="parent">Parent</option>
            </select>
            <input
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              placeholder="School ID"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              disabled={isLocked || !isSuperAdmin}
            />
            <button
              type="submit"
              disabled={isSaving || isLocked}
              className={`md:col-span-2 rounded-lg py-2.5 text-sm font-semibold text-black ${isLocked ? 'bg-[var(--dash-card)] opacity-60 cursor-not-allowed' : 'bg-[var(--dash-accent)]'}`}
            >
              {isSaving ? 'Creating...' : 'Create User'}
            </button>
          </form>
          {status && <div className="mt-4 text-xs text-emerald-400">{status}</div>}
          {!isSuperAdmin && (
            <div className="mt-4 text-xs text-[var(--dash-muted)]">
              Only Super Admins can create other Super Admins.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Quick Stats</h2>
          <div className="mt-6 space-y-3">
            {[
              { label: 'Total Users', value: users.length },
              { label: 'Admins', value: users.filter((u) => u.role === 'admin').length },
              { label: 'Super Admins', value: users.filter((u) => u.role === 'super_admin').length },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3">
                <div className="text-xs text-[var(--dash-muted)]">{item.label}</div>
                <div className="text-2xl font-semibold mt-2">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
        <h2 className="text-lg font-semibold">User Directory</h2>
        <div className="mt-6 space-y-3">
          {users.length === 0 && <div className="text-[var(--dash-muted)]">No users yet.</div>}
          {users.map((user) => (
            <div key={user.id} className="flex flex-col gap-3 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3">
              {editingId === user.id ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={draft.displayName ?? ''}
                    onChange={(e) => setDraft({ ...draft, displayName: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.email ?? ''}
                    onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.role ?? ''}
                    onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.schoolId ?? ''}
                    onChange={(e) => setDraft({ ...draft, schoolId: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <div className="flex gap-2 md:col-span-2">
                    <button type="button" onClick={saveEdit} disabled={isLocked} className={`rounded-lg px-4 py-2 text-xs font-semibold text-black ${isLocked ? 'bg-[var(--dash-card)] opacity-60 cursor-not-allowed' : 'bg-[var(--dash-accent)]'}`}>Save</button>
                    <button type="button" onClick={cancelEdit} className="rounded-lg border border-[var(--dash-border)] px-4 py-2 text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="font-semibold">{user.displayName ?? 'User'}</div>
                    <div className="text-xs text-[var(--dash-muted)]">{user.email ?? 'n/a'} · {user.role ?? 'n/a'}</div>
                    {user.schoolId && <div className="text-xs text-[var(--dash-muted)]">School: {user.schoolId}</div>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={() => startEdit(user)} disabled={isLocked} className={`text-xs ${isLocked ? 'text-[var(--dash-muted)] cursor-not-allowed' : 'text-[var(--dash-accent)]'}`}>Edit</button>
                    <button type="button" onClick={() => handleDelete(user.id)} disabled={isLocked} className={`text-xs ${isLocked ? 'text-[var(--dash-muted)] cursor-not-allowed' : 'text-red-400'}`}>Delete</button>
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

export default Users;
