import React from 'react';
import DashboardShell from '../components/DashboardShell';

const DashboardTeacher: React.FC = () => {
  return (
    <DashboardShell title="Teacher Workspace" role="Teacher" homePath="/dashboard/teacher">
      <section className="grid gap-6 lg:grid-cols-4">
        {[
          { label: 'Classes Today', value: '6', delta: '2 labs scheduled' },
          { label: 'Attendance', value: '98%', delta: 'First period' },
          { label: 'Assignments Due', value: '14', delta: 'Next 48 hours' },
          { label: 'Parent Messages', value: '9', delta: 'Unread' },
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
          <h2 className="text-lg font-semibold">Upcoming Classes</h2>
          <div className="mt-6 space-y-4">
            {[
              { className: 'Grade 8 · Physics', time: '08:45 - 09:30', room: 'Lab 2' },
              { className: 'Grade 9 · Chemistry', time: '10:00 - 10:45', room: 'Lab 1' },
              { className: 'Grade 10 · Physics', time: '12:10 - 12:55', room: 'Hall B' },
            ].map((lesson) => (
              <div key={lesson.className} className="flex items-center justify-between rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3">
                <div>
                  <div className="font-semibold">{lesson.className}</div>
                  <div className="text-xs text-[var(--dash-muted)]">{lesson.time} · {lesson.room}</div>
                </div>
                <button className="text-xs text-[var(--dash-accent)]">Open</button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">To Grade</h2>
          <div className="mt-6 space-y-3">
            {[
              'Grade 9 Quiz · 38 submissions',
              'Grade 8 Lab Report · 24 submissions',
              'Grade 10 Homework · 32 submissions',
            ].map((item) => (
              <div key={item} className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3 text-sm text-[var(--dash-text)]/80">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
        <h2 className="text-lg font-semibold">Student Insights</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: 'High Performing', value: 62 },
            { label: 'Needs Support', value: 12 },
            { label: 'Pending Assignments', value: 48 },
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

export default DashboardTeacher;
