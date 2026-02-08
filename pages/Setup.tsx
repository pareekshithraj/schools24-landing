import React, { useEffect, useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Setup: React.FC = () => {
  const { user } = useAuth();
  const [hasSuperAdmin, setHasSuperAdmin] = useState<boolean | null>(null);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const check = async () => {
      const q = query(collection(db, 'users'), where('role', '==', 'super_admin'));
      const snap = await getDocs(q);
      setHasSuperAdmin(!snap.empty);
    };
    check();
  }, []);

  const promoteMe = async () => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      setStatus('Please sign up first.');
      return;
    }
    await updateDoc(ref, { role: 'super_admin' });
    setStatus('You are now a Super Admin.');
  };

  if (hasSuperAdmin === null) {
    return (
      <DashboardShell title="Setup" role="Setup" homePath="/setup">
        <div className="text-[var(--dash-muted)]">Loading setup...</div>
      </DashboardShell>
    );
  }

  if (hasSuperAdmin) {
    return (
      <DashboardShell title="Setup" role="Setup" homePath="/setup">
        <div className="text-[var(--dash-muted)]">Super Admin already configured.</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Initial Setup" role="Setup" homePath="/setup">
      <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
        <h2 className="text-lg font-semibold">Claim Super Admin</h2>
        <p className="text-sm text-[var(--dash-muted)] mt-2">
          No Super Admin exists yet. Click below to promote your account.
        </p>
        <button
          type="button"
          onClick={promoteMe}
          className="mt-6 rounded-lg bg-[var(--dash-accent)] px-6 py-3 text-sm font-semibold text-black"
        >
          Promote My Account
        </button>
        {status && <div className="mt-4 text-sm text-[var(--dash-accent)]">{status}</div>}
      </div>
    </DashboardShell>
  );
};

export default Setup;
