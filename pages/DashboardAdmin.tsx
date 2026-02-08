import React from 'react';
import DashboardShell from '../components/DashboardShell';

const DashboardAdmin: React.FC = () => {
  return (
    <DashboardShell title="School Admin Operations" role="Admin" homePath="/dashboard/admin">
      <section className="grid gap-6 lg:grid-cols-4">
        {[
          { label: 'Students', value: '1,240', delta: '+48 this week' },
          { label: 'Teachers', value: '92', delta: '3 pending approvals' },
          { label: 'Attendance', value: '96.2%', delta: 'Today' },
          { label: 'Fee Collection', value: '₹18.4L', delta: '86% collected' },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-5">
            <div className="text-sm text-[var(--dash-muted)]">{card.label}</div>
            <div className="mt-3 text-3xl font-semibold">{card.value}</div>
            <div className="mt-2 text-xs text-[var(--dash-accent)]">{card.delta}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Operational Checklist</h2>
          <div className="mt-6 space-y-3">
            {[
              'Approve new staff onboarding forms',
              'Review fee defaulters list',
              'Publish weekly timetable updates',
              'Audit transport routes for next term',
              'Finalize exam seating plans',
            ].map((task) => (
              <div key={task} className="flex items-center gap-3 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-[var(--dash-accent)]" />
                <div className="text-sm text-[var(--dash-text)]/80">{task}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <div className="mt-6 grid gap-3">
            {[
              'Create New Staff Account',
              'Enroll Students',
              'Send Fee Reminders',
              'Generate Report Cards',
              'Configure Bus Routes',
            ].map((action) => (
              <button key={action} className="text-left rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3 text-sm text-[var(--dash-text)]/80 hover:text-[var(--dash-text)]">
                {action}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
        <h2 className="text-lg font-semibold">People Management</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: 'Pending Student Requests', value: 24 },
            { label: 'Staff Leaves Today', value: 6 },
            { label: 'Parents Waiting Approval', value: 14 },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] p-4">
              <div className="text-xs text-[var(--dash-muted)]">{item.label}</div>
              <div className="text-2xl font-semibold mt-2">{item.value}</div>
            </div>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
};

export default DashboardAdmin;
