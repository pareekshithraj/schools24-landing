import React from 'react';
import DashboardShell from '../components/DashboardShell';
import { useCollection } from '../hooks/useCollection';

interface AuditRecord {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, any>;
}

const AuditLogs: React.FC = () => {
  const { data: logs, loading } = useCollection<AuditRecord>('audit_logs', { orderBy: 'createdAt', limit: 20 });

  return (
    <DashboardShell title="Audit Logs" role="Super Admin" homePath="/dashboard/super-admin">
      <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
        <h2 className="text-lg font-semibold">Latest Activity</h2>
        <div className="mt-6 space-y-3 text-sm">
          {loading && <div className="text-[var(--dash-muted)]">Loading...</div>}
          {!loading && logs.length === 0 && <div className="text-[var(--dash-muted)]">No audit logs yet.</div>}
          {logs.map((log) => (
            <div key={log.id} className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3">
              <div className="font-semibold">{log.action} · {log.entity}</div>
              <div className="text-xs text-[var(--dash-muted)]">ID: {log.entityId ?? 'n/a'}</div>
              {log.metadata && (
                <div className="text-xs text-[var(--dash-muted)]">{JSON.stringify(log.metadata)}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
};

export default AuditLogs;
