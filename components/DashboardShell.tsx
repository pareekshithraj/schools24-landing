import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface DashboardShellProps {
  title: string;
  role: string;
  homePath: string;
  children: React.ReactNode;
}

const DashboardShell: React.FC<DashboardShellProps> = ({ title, role, homePath, children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const { signOut } = useAuth();

  const location = useLocation();
  const roleKey = role.toLowerCase().replace(' ', '_');

  const navItems = [
    { label: 'Overview', path: homePath, roles: ['super_admin', 'admin', 'teacher', 'student', 'driver', 'parent', 'setup'] },
    { label: 'Schools', path: '/dashboard/schools', roles: ['super_admin'] },
    { label: 'Admissions', path: '/dashboard/admissions', roles: ['admin'] },
    { label: 'Users', path: '/dashboard/users', roles: ['admin'] },
    { label: 'Classes', path: '/dashboard/classes', roles: ['admin', 'teacher'] },
    { label: 'Attendance', path: '/dashboard/attendance', roles: ['admin', 'teacher'] },
    { label: 'Exams', path: '/dashboard/exams', roles: ['admin', 'teacher'] },
    { label: 'Transport', path: '/dashboard/transport', roles: ['admin', 'driver'] },
    { label: 'Inventory', path: '/dashboard/inventory', roles: ['admin'] },
    { label: 'Notifications', path: '/dashboard/notifications', roles: ['admin', 'teacher'] },
    { label: 'Reports', path: '/dashboard/reports', roles: ['admin'] },
    { label: 'Documents', path: '/dashboard/uploads', roles: ['admin'] },
    { label: 'Audit Logs', path: '/dashboard/audit', roles: ['super_admin'] },
    { label: 'Profile', path: '/dashboard/profile', roles: ['super_admin', 'admin', 'teacher', 'student', 'driver', 'parent'] },
    { label: 'Payments', path: '/payments', roles: ['admin', 'student', 'parent'] },
  ].filter((item) => item.roles.includes(roleKey));

  const themeVars = useMemo(() => {
    if (theme === 'light') {
      return {
        '--dash-bg': '#f8fafc',
        '--dash-panel': '#ffffff',
        '--dash-card': '#f1f5f9',
        '--dash-border': 'rgba(15, 23, 42, 0.12)',
        '--dash-text': '#0f172a',
        '--dash-muted': 'rgba(15, 23, 42, 0.6)',
        '--dash-accent': '#f59e0b',
        '--dash-accent-strong': '#d97706',
      } as React.CSSProperties;
    }

    return {
      '--dash-bg': '#0f172a',
      '--dash-panel': 'rgba(15, 23, 42, 0.6)',
      '--dash-card': 'rgba(30, 41, 59, 0.4)',
      '--dash-border': 'rgba(255, 255, 255, 0.05)',
      '--dash-text': '#f8fafc',
      '--dash-muted': 'rgba(148, 163, 184, 0.8)',
      '--dash-accent': '#f59e0b',
      '--dash-accent-strong': '#fb923c',
    } as React.CSSProperties;
  }, [theme]);

  // FIXED LAYOUT: h-screen, overflow-hidden on root. Sidebar is flex-none. Main is flex-1 with overflow-y-auto.
  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[var(--dash-bg)] text-[var(--dash-text)]" style={themeVars}>
      {/* Sidebar: Fixed width, full height of container */}
      <aside className="hidden lg:flex lg:flex-col w-72 flex-none h-full border-r border-[var(--dash-border)] bg-[var(--dash-panel)] backdrop-blur-md z-20 shadow-xl">
        <div className="px-6 py-6 border-b border-[var(--dash-border)]">
          <div className="flex items-center gap-3">
            <img src="/logo-icon.png" alt="Schools24" className="h-10 w-10 object-contain" />
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-[var(--dash-muted)]">Portal</div>
              <div className="text-lg font-semibold">{role}</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 text-sm custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`block px-4 py-2 rounded-xl transition ${isActive
                  ? 'bg-[var(--dash-card)] text-[var(--dash-text)]'
                  : 'text-[var(--dash-muted)] hover:text-[var(--dash-text)] hover:bg-[var(--dash-card)]'
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-6 py-6 border-t border-[var(--dash-border)] text-xs text-[var(--dash-muted)]">
          <div className="flex items-center justify-between">
            <span>Support</span>
            <span className="text-[var(--dash-accent)]">24/7</span>
          </div>
        </div>
      </aside>

      {/* Main Content: Takes remaining width, handles its own scrolling */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <header className="flex-shrink-0 flex items-center justify-between px-6 lg:px-10 py-6 border-b border-[var(--dash-border)] bg-[var(--dash-panel)] backdrop-blur-xl">
          <div>
            <div className="text-[var(--dash-muted)] text-sm">Schools24 OS</div>
            <h1 className="text-2xl font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-[var(--dash-card)] border border-[var(--dash-border)] rounded-full px-4 py-2 text-sm text-[var(--dash-muted)]">
              <span className="text-[var(--dash-muted)]">Search</span>
              <span className="text-[var(--dash-muted)]">Ctrl + K</span>
            </div>
            <button
              className="h-10 w-10 rounded-full bg-[var(--dash-card)] border border-[var(--dash-border)]"
              aria-label="Notifications"
            />
            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
              className="px-4 py-2 rounded-full border border-[var(--dash-border)] bg-[var(--dash-card)] text-xs font-semibold"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              type="button"
              onClick={() => signOut()}
              className="px-4 py-2 rounded-full border border-[var(--dash-border)] bg-[var(--dash-card)] text-xs font-semibold"
            >
              Sign Out
            </button>
            <Link
              to="/login"
              className="px-4 py-2 rounded-full bg-[var(--dash-text)] text-[var(--dash-bg)] text-sm font-semibold"
            >
              Switch Portal
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="relative px-6 lg:px-10 py-8 space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
