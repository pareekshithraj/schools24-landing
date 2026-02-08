import React, { useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import { useAuth } from '../contexts/AuthContext';
import { createNotification, deleteRecord, updateRecord } from '../services/firestore';
import { useCollection } from '../hooks/useCollection';
import { sendNotificationNow } from '../services/notifications';
import { useToast } from '../components/ToastProvider';

interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  channel: string;
  audience: string;
  status: string;
}

const Notifications: React.FC = () => {
  const { profile } = useAuth();
  const { push } = useToast();
  const [title, setTitle] = useState('Fee Reminder');
  const [message, setMessage] = useState('Reminder: Term 2 fees are due by Nov 12.');
  const [channel, setChannel] = useState('Email');
  const [audience, setAudience] = useState('Parents');
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<NotificationRecord>>({});

  const { data: notifications } = useCollection<NotificationRecord>('notifications', { orderBy: 'createdAt', limit: 6 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await createNotification({ title, message, channel, audience, schoolId: profile?.schoolId });
      await sendNotificationNow({ title, message, channel, audience });
      push({ type: 'success', title: 'Notification sent', message: 'Delivery initiated.' });
    } catch (err: any) {
      push({ type: 'error', title: 'Send failed', message: err?.message ?? 'Please try again.' });
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    await deleteRecord('notifications', id);
  };

  const startEdit = (item: NotificationRecord) => {
    setEditingId(item.id);
    setDraft(item);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updateRecord('notifications', editingId, {
      title: draft.title,
      message: draft.message,
      channel: draft.channel,
      audience: draft.audience,
      status: draft.status,
    });
    cancelEdit();
  };

  return (
    <DashboardShell title="Notifications Hub" role="Admin" homePath="/dashboard/admin">
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Compose Notification</h2>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm min-h-[110px]"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              >
                <option>Email</option>
                <option>SMS</option>
                <option>Push</option>
              </select>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              >
                <option>Parents</option>
                <option>Students</option>
                <option>Teachers</option>
                <option>All Users</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-[var(--dash-accent)] py-2.5 text-sm font-semibold text-black"
            >
              {isSaving ? 'Scheduling...' : 'Schedule Notification'}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Channel Health</h2>
          <div className="mt-6 space-y-3">
            {['Email 98% delivery', 'SMS 94% delivery', 'Push 99% delivery'].map((item) => (
              <div key={item} className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
        <h2 className="text-lg font-semibold">Recent Notifications</h2>
        <div className="mt-6 space-y-3">
          {notifications.length === 0 && <div className="text-[var(--dash-muted)]">No notifications yet.</div>}
          {notifications.map((note) => (
            <div key={note.id} className="flex flex-col gap-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3">
              {editingId === note.id ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={draft.title ?? ''}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.channel ?? ''}
                    onChange={(e) => setDraft({ ...draft, channel: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.audience ?? ''}
                    onChange={(e) => setDraft({ ...draft, audience: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.status ?? ''}
                    onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <textarea
                    value={draft.message ?? ''}
                    onChange={(e) => setDraft({ ...draft, message: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm md:col-span-2"
                  />
                  <div className="flex gap-2 md:col-span-2">
                    <button type="button" onClick={saveEdit} className="rounded-lg bg-[var(--dash-accent)] px-4 py-2 text-xs font-semibold text-black">Save</button>
                    <button type="button" onClick={cancelEdit} className="rounded-lg border border-[var(--dash-border)] px-4 py-2 text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="font-semibold">{note.title}</div>
                    <div className="text-xs text-[var(--dash-muted)]">{note.channel} · {note.audience}</div>
                  </div>
                  <div className="text-xs text-[var(--dash-muted)]">{note.message}</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs rounded-full border border-[var(--dash-border)] px-3 py-1 text-[var(--dash-muted)]">{note.status}</span>
                    <button type="button" onClick={() => startEdit(note)} className="text-xs text-[var(--dash-accent)]">Edit</button>
                    <button type="button" onClick={() => handleDelete(note.id)} className="text-xs text-red-400">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
};

export default Notifications;
