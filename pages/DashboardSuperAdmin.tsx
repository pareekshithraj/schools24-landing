import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import { useCollection } from '../hooks/useCollection';
import { createUserWithDefaultPassword } from '../services/users';
import { useToast } from '../components/ToastProvider';

interface UserRecord {
  id: string;
  displayName?: string;
  email?: string;
  role?: string;
}

const DashboardSuperAdmin: React.FC = () => {
  const { push } = useToast();
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const { data: users } = useCollection<UserRecord>('users', { orderBy: 'createdAt', limit: 50 });
  const { data: admissions } = useCollection<any>('admissions', { orderBy: 'createdAt', limit: 50 });

  const admins = users.filter((u) => u.role === 'admin');
  const superAdmins = users.filter((u) => u.role === 'super_admin');

  const handleApproveSchool = async (admission: any) => {
    if (!window.confirm(`Create Admin for ${admission.schoolName}?`)) return;
    setStatus(null);
    try {
      await createUserWithDefaultPassword({
        name: admission.contactName,
        email: admission.email,
        role: 'admin',
        schoolId: `school_${Date.now()}`
      });
      setStatus(`Admin created for ${admission.schoolName}. Password: qwe123`);
      push({ type: 'success', title: 'School Approved', message: `Admin credentials created for ${admission.email}` });
    } catch (err: any) {
      push({ type: 'error', title: 'Approval Failed', message: err.message });
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    setStatus(null);
    try {
      await createUserWithDefaultPassword({ name: inviteName, email: inviteEmail, role: 'super_admin' });
      setStatus('Super Admin created. Re-login with qwe123.');
      push({ type: 'success', title: 'Super Admin created', message: 'Default password is qwe123.' });
      setInviteName('');
      setInviteEmail('');
    } catch (err: any) {
      push({ type: 'error', title: 'Create failed', message: err?.message ?? 'Please try again.' });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <DashboardShell title="Super Admin Command Center" role="Super Admin" homePath="/dashboard/super-admin">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--dash-border)] bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--dash-accent)]">Global Control</div>
            <h2 className="mt-2 text-3xl font-bold text-white">Schools24 Executive Console</h2>
            <p className="mt-2 text-base text-indigo-100/80">Manage school onboarding, lock controls, and admin provisioning from a single view.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/dashboard/schools" className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-indigo-900 shadow-lg hover:bg-indigo-50 transition-colors">Open School Provisioning</Link>
            <Link to="/dashboard/audit" className="rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors">View Audit Logs</Link>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-4">
        {[
          { label: 'Total Schools', value: '128', delta: '+12 this month', color: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-500' },
          { label: 'Active Admins', value: admins.length.toString(), delta: 'Admins in system', color: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-500' },
          { label: 'Super Admins', value: superAdmins.length.toString(), delta: 'Global operators', color: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-500' },
          { label: 'Students Enrolled', value: '86,430', delta: '+3,240 this term', color: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-500' },
        ].map((card) => (
          <div key={card.label} className={`rounded-2xl border ${card.border} ${card.color} p-5 backdrop-blur-sm`}>
            <div className="text-sm font-medium text-[var(--dash-muted)]">{card.label}</div>
            <div className="mt-3 text-4xl font-bold text-[var(--dash-text)]">{card.value}</div>
            <div className={`mt-2 text-xs font-semibold ${card.text}`}>{card.delta}</div>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6 backdrop-blur-md">
          <h2 className="text-lg font-semibold text-[var(--dash-text)]">Create Super Admin</h2>
          <p className="text-sm text-[var(--dash-muted)] mt-2">Default password is <code className="bg-[var(--dash-card)] px-1.5 py-0.5 rounded text-[var(--dash-text)]">qwe123</code>.</p>
          <form onSubmit={handleInvite} className="mt-6 space-y-4">
            <input
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="Full Name"
              className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3 text-sm text-[var(--dash-text)] placeholder-[var(--dash-muted)] focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
            <input
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3 text-sm text-[var(--dash-text)] placeholder-[var(--dash-muted)] focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              disabled={isInviting}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 transition-all"
            >
              {isInviting ? 'Creating...' : 'Create Super Admin'}
            </button>
          </form>
          {status && <div className="mt-3 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">{status}</div>}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--dash-text)]">Admin Directory</h2>
              <span className="text-xs font-medium text-[var(--dash-muted)]">{admins.length} Admins · {superAdmins.length} Super Admins</span>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {users.slice(0, 6).map((u) => (
                <div key={u.id} className="group relative overflow-hidden rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] p-4 hover:border-[var(--dash-accent)]">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {u.displayName?.[0] || 'U'}
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[var(--dash-muted)]">{u.role}</div>
                      <div className="font-semibold text-[var(--dash-text)]">{u.displayName ?? 'User'}</div>
                      <div className="text-xs text-[var(--dash-muted)]">{u.email}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-[var(--dash-text)]">Pending Admissions</h2>
            <div className="mt-4 space-y-3">
              {admissions.length === 0 && <div className="text-sm text-[var(--dash-muted)]">No new requests.</div>}
              {admissions.map((adm: any) => (
                <div key={adm.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] p-4">
                  <div>
                    <div className="font-bold text-[var(--dash-text)]">{adm.schoolName}</div>
                    <div className="text-xs text-[var(--dash-muted)]">{adm.city} · {adm.contactName} · {adm.email}</div>
                  </div>
                  <button
                    onClick={() => handleApproveSchool(adm)}
                    className="rounded-lg bg-[var(--dash-accent)] px-4 py-2 text-xs font-bold text-black hover:opacity-90 whitespace-nowrap"
                  >
                    Approve & Create Admin
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
};

export default DashboardSuperAdmin;
