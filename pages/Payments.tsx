import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSchoolLocks } from '../hooks/useSchoolLocks';
import LockBanner from '../components/LockBanner';
import DashboardShell from '../components/DashboardShell';

const gateways = [
  { id: 'razorpay', name: 'Razorpay Test', note: 'UPI, cards, netbanking' },
  { id: 'stripe', name: 'Stripe Test', note: 'Cards, wallets, international' },
];

const invoices = [
  { id: 'INV-2048', title: 'Term 2 Tuition', amount: 8500, due: 'Nov 12, 2025', status: 'Due' },
  { id: 'INV-2052', title: 'Transport Fee', amount: 2200, due: 'Nov 20, 2025', status: 'Due' },
  { id: 'INV-2017', title: 'Activity Fee', amount: 1500, due: 'Sep 10, 2025', status: 'Paid' },
];

const Payments: React.FC = () => {
  const { profile } = useAuth();
  const isSuperAdmin = profile?.role === 'super_admin';
  const { locks } = useSchoolLocks();
  const isLocked = !isSuperAdmin && Boolean(locks.finance);
  const [selectedGateway, setSelectedGateway] = useState(gateways[0].id);
  const [selectedInvoice, setSelectedInvoice] = useState(invoices[0].id);

  return (
    <DashboardShell title="Payments Center" role="Admin" homePath="/dashboard/admin">
      {isLocked && (
        <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-5">
          <LockBanner
            title="Finance module is locked"
            description="Payments are disabled until the lock is removed by the super admin."
          />
        </section>
      )}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Outstanding Invoices</h2>
            <span className="text-xs rounded-full border border-[var(--dash-border)] px-3 py-1 text-[var(--dash-muted)]">Mock Data</span>
          </div>
          <div className="mt-6 space-y-4">
            {invoices.map((invoice) => (
              <button
                key={invoice.id}
                type="button"
                onClick={() => !isLocked && setSelectedInvoice(invoice.id)}
                className={`w-full text-left rounded-xl border border-[var(--dash-border)] p-4 transition ${selectedInvoice === invoice.id ? 'bg-[var(--dash-card)]' : 'bg-[var(--dash-panel)]'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{invoice.title}</div>
                    <div className="text-xs text-[var(--dash-muted)]">Invoice {invoice.id} · Due {invoice.due}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">₹{invoice.amount.toLocaleString()}</div>
                    <div className={`text-xs ${invoice.status === 'Paid' ? 'text-emerald-400' : 'text-[var(--dash-accent)]'}`}>{invoice.status}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Checkout</h2>
          <p className="text-sm text-[var(--dash-muted)] mt-2">Choose a payment gateway and continue to pay.</p>

          <div className="mt-6 space-y-3">
            {gateways.map((gateway) => (
              <button
                key={gateway.id}
                type="button"
                onClick={() => !isLocked && setSelectedGateway(gateway.id)}
                className={`w-full text-left rounded-xl border px-4 py-3 transition ${selectedGateway === gateway.id ? 'border-[var(--dash-accent)] bg-[var(--dash-card)]' : 'border-[var(--dash-border)] bg-[var(--dash-panel)]'}`}
              >
                <div className="text-sm font-semibold">{gateway.name}</div>
                <div className="text-xs text-[var(--dash-muted)]">{gateway.note}</div>
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={isLocked}
            className={`mt-6 w-full rounded-lg py-3 text-sm font-semibold text-black ${isLocked ? 'bg-[var(--dash-card)] opacity-60 cursor-not-allowed' : 'bg-[var(--dash-accent)]'}`}
          >
            Proceed to Pay (Test Mode)
          </button>

          <div className="mt-6 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] p-4 text-xs text-[var(--dash-muted)]">
            Payment gateway keys are not configured yet. This flow is UI-only and will be wired to Razorpay + Stripe in test mode once keys are added.
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
        <h2 className="text-lg font-semibold">Payment History</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: 'Oct 5, 2025', value: '₹8,500', note: 'Tuition fee paid' },
            { label: 'Sep 10, 2025', value: '₹1,500', note: 'Activity fee paid' },
            { label: 'Aug 12, 2025', value: '₹2,200', note: 'Transport fee paid' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] p-4">
              <div className="text-xs text-[var(--dash-muted)]">{item.label}</div>
              <div className="text-2xl font-semibold mt-2">{item.value}</div>
              <div className="text-xs text-[var(--dash-muted)] mt-2">{item.note}</div>
            </div>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
};

export default Payments;
