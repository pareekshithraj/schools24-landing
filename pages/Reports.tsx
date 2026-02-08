import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSchoolLocks } from '../hooks/useSchoolLocks';
import LockBanner from '../components/LockBanner';
import DashboardShell from '../components/DashboardShell';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const performanceData = [
  { name: 'W1', score: 72, attendance: 94 },
  { name: 'W2', score: 78, attendance: 95 },
  { name: 'W3', score: 74, attendance: 96 },
  { name: 'W4', score: 82, attendance: 97 },
  { name: 'W5', score: 88, attendance: 95 },
  { name: 'W6', score: 84, attendance: 96 },
  { name: 'W7', score: 92, attendance: 98 },
];

const feeData = [
  { name: 'Jan', value: 12 },
  { name: 'Feb', value: 18 },
  { name: 'Mar', value: 20 },
  { name: 'Apr', value: 15 },
  { name: 'May', value: 24 },
  { name: 'Jun', value: 28 },
];

const channelData = [
  { name: 'Email', value: 62 },
  { name: 'SMS', value: 22 },
  { name: 'Push', value: 16 },
];

const COLORS = ['#f59e0b', '#fb7185', '#38bdf8'];

const Reports: React.FC = () => {
  const { profile } = useAuth();
  const isSuperAdmin = profile?.role === 'super_admin';
  const { locks } = useSchoolLocks();
  const isLocked = !isSuperAdmin && Boolean(locks.finance);
  return (
    <DashboardShell title="Reports & Analytics" role="Admin" homePath="/dashboard/admin">
      <section className="grid gap-6 lg:grid-cols-4">
        {[
          { label: 'Total Users', value: '1,480' },
          { label: 'Attendance Avg', value: '96.2%' },
          { label: 'Fee Collection', value: '₹84.2L' },
          { label: 'Active Schools', value: '128' },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-5">
            <div className="text-sm text-[var(--dash-muted)]">{card.label}</div>
            <div className="mt-3 text-3xl font-semibold">{card.value}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Performance Trends</h2>
            <span className="text-xs text-[var(--dash-muted)]">Weekly</span>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <XAxis dataKey="name" stroke="var(--dash-muted)" />
                <YAxis stroke="var(--dash-muted)" />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} />
                <Line type="monotone" dataKey="attendance" stroke="#38bdf8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Engagement Split</h2>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={channelData} dataKey="value" nameKey="name" outerRadius={90}>
                  {channelData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Fee Collection Trend</h2>
            <span className="text-xs text-[var(--dash-muted)]">₹ in Lakh</span>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feeData}>
                <XAxis dataKey="name" stroke="var(--dash-muted)" />
                <YAxis stroke="var(--dash-muted)" />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Report Actions</h2>
          <div className="mt-6 space-y-3">
            {['Export Attendance CSV', 'Generate Fee Report', 'Download Student Progress', 'Email Weekly Summary'].map((item) => (
              <button key={item} className="w-full text-left rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3 text-sm">
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
        <h2 className="text-lg font-semibold">Departmental Snapshot</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: 'Academics', value: 'Strong', note: '92% completion' },
            { label: 'Transport', value: 'Stable', note: '98% on-time' },
            { label: 'Finance', value: 'Growing', note: '86% collected' },
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

export default Reports;
