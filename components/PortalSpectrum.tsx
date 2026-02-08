import React from 'react';
import { Link } from 'react-router-dom';

const PortalSpectrum: React.FC = () => {
  return (
    <section id="portals" className="snap-section relative bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.15)_0%,transparent_55%),radial-gradient(circle_at_80%_0%,rgba(245,158,11,0.12)_0%,transparent_50%)]" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.4em] text-white/40">SaaS Command Center</div>
            <h2 className="mt-4 text-4xl md:text-5xl font-black">Every Role. One OS.</h2>
            <p className="mt-4 text-white/70 text-lg">
              Schools24 unifies leadership, administration, and daily operations in role-specific portals. Each user sees
              a focused dashboard with the exact controls they need.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="px-6 py-3 rounded-full bg-white text-black font-semibold">
              Access Portals
            </Link>
            <Link to="/register" className="px-6 py-3 rounded-full border border-white/20 text-white font-semibold">
              Start a School
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Super Admin',
              detail: 'Global oversight, school provisioning, compliance, and revenue controls.',
            },
            {
              title: 'School Admin',
              detail: 'Operations, fee management, staff onboarding, and admissions pipeline.',
            },
            {
              title: 'Teacher',
              detail: 'Lessons, grading, attendance, and parent collaboration.',
            },
            {
              title: 'Student',
              detail: 'Schedule, assignments, performance analytics, and campus updates.',
            },
            {
              title: 'Driver',
              detail: 'Live routes, pickup confirmations, safety alerts, and fleet health.',
            },
            {
              title: 'Parents',
              detail: 'Fees, attendance, learning updates, and secure communication.',
            },
          ].map((portal) => (
            <div key={portal.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="text-sm uppercase tracking-[0.3em] text-white/40">Portal</div>
              <h3 className="mt-3 text-2xl font-semibold">{portal.title}</h3>
              <p className="mt-3 text-sm text-white/70">{portal.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/60 p-6">
            <h3 className="text-lg font-semibold">Unified SaaS Dashboard</h3>
            <p className="text-sm text-white/60 mt-2">
              A single command layer for analytics, system health, and workflow automation across every school.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Real-time KPIs', value: 'Attendance, finance, transport' },
                { label: 'Smart Alerts', value: 'Risk, compliance, safety' },
                { label: 'AI Insights', value: 'Predictive student support' },
                { label: 'Role Controls', value: 'Fine-grained permissions' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-white/50">{item.label}</div>
                  <div className="mt-2 text-sm font-semibold">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-black/60 to-black p-6">
            <h3 className="text-lg font-semibold">Launch in 48 Hours</h3>
            <p className="text-sm text-white/60 mt-2">
              Provision a new school, onboard admins, and activate portals with automated workflows.
            </p>
            <div className="mt-6 space-y-4 text-sm">
              {[
                'Step 1: Register school and configure board',
                'Step 2: Invite admins, teachers, and drivers',
                'Step 3: Import students and set fee plans',
                'Step 4: Go live with attendance + transport',
              ].map((step) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-orange)]" />
                  <span className="text-white/80">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortalSpectrum;
