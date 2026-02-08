import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import { useAuth } from '../contexts/AuthContext';
import { updateRecord } from '../services/firestore';
import { updatePassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useToast } from '../components/ToastProvider';

const Profile: React.FC = () => {
  const { profile, user } = useAuth();
  const { push } = useToast();
  const location = useLocation();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  // Check if redirected for forced change
  const forcedMessage = location.state?.message;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    try {
      await updateRecord('users', profile.uid, { displayName });
      push({ type: 'success', title: 'Profile updated', message: 'Your changes were saved.' });
    } catch (err: any) {
      push({ type: 'error', title: 'Update failed', message: err?.message ?? 'Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    if (newPassword.length < 6) {
      push({ type: 'error', title: 'Weak Password', message: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      push({ type: 'error', title: 'Mismatch', message: 'Passwords do not match.' });
      return;
    }

    setIsPasswordSaving(true);
    try {
      await updatePassword(user, newPassword);

      // Remove the flag
      if (profile.mustChangePassword) {
        await updateRecord('users', profile.uid, { mustChangePassword: false });
      }

      push({ type: 'success', title: 'Password Changed', message: 'Your password has been updated.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      push({ type: 'error', title: 'Error', message: err.message ?? 'Failed to update password. You may need to re-login.' });
    } finally {
      setIsPasswordSaving(false);
    }
  };

  if (!profile) {
    return null;
  }

  const roleLabel = profile.role.replace('_', ' ');
  const homePathMap: Record<string, string> = {
    super_admin: '/dashboard/super-admin',
    admin: '/dashboard/admin',
    teacher: '/dashboard/teacher',
    student: '/dashboard/student',
    driver: '/dashboard/driver',
    parent: '/dashboard/parent',
  };

  return (
    <DashboardShell title="Profile" role={roleLabel} homePath={homePathMap[profile.role] ?? '/dashboard/student'}>
      {forcedMessage && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold">
          ⚠️ {forcedMessage}
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
            <h2 className="text-lg font-semibold">Account Details</h2>
            <p className="text-sm text-[var(--dash-muted)] mt-2">Update the profile details visible to your school.</p>
            <form onSubmit={handleSave} className="mt-6 grid gap-4">
              <div>
                <label className="text-xs text-[var(--dash-muted)]">Display Name</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
                  placeholder="Your name"
                />
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className={`w-full rounded-xl py-2.5 text-sm font-semibold text-black ${isSaving ? 'bg-[var(--dash-card)] opacity-70 cursor-not-allowed' : 'bg-[var(--dash-accent)]'}`}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
            <h2 className="text-lg font-semibold">Change Password</h2>
            <p className="text-sm text-[var(--dash-muted)] mt-2">Ensure your account is secure.</p>
            <form onSubmit={handleChangePassword} className="mt-6 grid gap-4">
              <div>
                <label className="text-xs text-[var(--dash-muted)]">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
                  placeholder="Min 6 characters"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--dash-muted)]">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
                  placeholder="Re-enter password"
                />
              </div>
              <button
                type="submit"
                disabled={isPasswordSaving}
                className={`w-full rounded-xl py-2.5 text-sm font-semibold text-white ${isPasswordSaving ? 'bg-indigo-900/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'}`}
              >
                {isPasswordSaving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

        </div>

        <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6 h-fit">
          <h2 className="text-lg font-semibold">Profile Summary</h2>
          <div className="mt-6 space-y-3 text-sm">
            <div className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3">
              <div className="text-xs text-[var(--dash-muted)]">Email</div>
              <div className="mt-1 font-semibold">{profile.email}</div>
            </div>
            <div className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3">
              <div className="text-xs text-[var(--dash-muted)]">Role</div>
              <div className="mt-1 font-semibold capitalize">{roleLabel}</div>
            </div>
            <div className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3">
              <div className="text-xs text-[var(--dash-muted)]">School ID</div>
              <div className="mt-1 font-semibold">{profile.schoolId || 'Global'}</div>
            </div>
            {profile.mustChangePassword && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400 font-bold text-center">
                Action Required: Change Password
              </div>
            )}
          </div>
        </div>
      </section>
    </DashboardShell>
  );
};

export default Profile;
