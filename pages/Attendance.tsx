import React, { useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import { useAuth } from '../contexts/AuthContext';
import { useSchoolLocks } from '../hooks/useSchoolLocks';
import LockBanner from '../components/LockBanner';
import { deleteRecord, recordAttendance, updateRecord } from '../services/firestore';
import { useCollection } from '../hooks/useCollection';
import { useToast } from '../components/ToastProvider';

interface AttendanceRecord {
  id: string;
  classId: string;
  date: string;
  present: number;
  absent: number;
}

const Attendance: React.FC = () => {
  const { profile } = useAuth();
  const isSuperAdmin = profile?.role === 'super_admin';
  const { push } = useToast();
  const { locks } = useSchoolLocks();
  const isLocked = !isSuperAdmin && Boolean(locks.academics);
  const [classId, setClassId] = useState('Grade 6 A');
  const [date, setDate] = useState('2026-02-03');
  const [present, setPresent] = useState(32);
  const [absent, setAbsent] = useState(2);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<AttendanceRecord>>({});

  const { data: records } = useCollection<AttendanceRecord>('attendance_records', { orderBy: 'createdAt', limit: 6 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setIsSaving(true);
    try {
      await recordAttendance({ classId, date, present, absent, schoolId: profile?.schoolId });
      push({ type: 'success', title: 'Attendance saved', message: `${classId} on ${date}` });
    } catch (err: any) {
      push({ type: 'error', title: 'Save failed', message: err?.message ?? 'Please try again.' });
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (isLocked) return;
    await deleteRecord('attendance_records', id);
  };

  const startEdit = (item: AttendanceRecord) => {
    setEditingId(item.id);
    setDraft(item);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = async () => {
    if (!editingId || isLocked) return;
    await updateRecord('attendance_records', editingId, {
      classId: draft.classId,
      date: draft.date,
      present: draft.present,
      absent: draft.absent,
    });
    cancelEdit();
  };

  return (
    <DashboardShell title="Attendance Tracker" role="Teacher" homePath="/dashboard/teacher">
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Mark Attendance</h2>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              placeholder="Class"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              disabled={isLocked}
            />
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              disabled={isLocked}
            />
            <input
              value={present}
              onChange={(e) => setPresent(Number(e.target.value))}
              type="number"
              placeholder="Present"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              disabled={isLocked}
            />
            <input
              value={absent}
              onChange={(e) => setAbsent(Number(e.target.value))}
              type="number"
              placeholder="Absent"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              disabled={isLocked}
            />
            <button
              type="submit"
              disabled={isSaving || isLocked}
              className={`md:col-span-2 rounded-lg py-2.5 text-sm font-semibold text-black ${isLocked ? 'bg-[var(--dash-card)] opacity-60 cursor-not-allowed' : 'bg-[var(--dash-accent)]'}`}
            >
              {isSaving ? 'Saving...' : 'Submit Attendance'}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Attendance Insights</h2>
          <div className="mt-6 space-y-3">
            {[
              { label: 'Average Attendance', value: '96.4%' },
              { label: 'Lowest Today', value: 'Grade 9 B' },
              { label: 'Highest Today', value: 'Grade 3 A' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3">
                <div className="text-xs text-[var(--dash-muted)]">{item.label}</div>
                <div className="text-lg font-semibold mt-2">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
        <h2 className="text-lg font-semibold">Recent Submissions</h2>
        <div className="mt-6 space-y-3">
          {records.length === 0 && <div className="text-[var(--dash-muted)]">No attendance records yet.</div>}
          {records.map((record) => (
            <div key={record.id} className="flex flex-col gap-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3">
              {editingId === record.id ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={draft.classId ?? ''}
                    onChange={(e) => setDraft({ ...draft, classId: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.date ?? ''}
                    onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                    type="date"
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.present ?? 0}
                    onChange={(e) => setDraft({ ...draft, present: Number(e.target.value) })}
                    type="number"
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.absent ?? 0}
                    onChange={(e) => setDraft({ ...draft, absent: Number(e.target.value) })}
                    type="number"
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <div className="flex gap-2 md:col-span-2">
                    <button type="button" onClick={saveEdit} disabled={isLocked} className={`rounded-lg px-4 py-2 text-xs font-semibold text-black ${isLocked ? 'bg-[var(--dash-card)] opacity-60 cursor-not-allowed' : 'bg-[var(--dash-accent)]'}`}>Save</button>
                    <button type="button" onClick={cancelEdit} className="rounded-lg border border-[var(--dash-border)] px-4 py-2 text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="font-semibold">{record.classId}</div>
                    <div className="text-xs text-[var(--dash-muted)]">{record.date}</div>
                  </div>
                  <div className="text-xs text-[var(--dash-muted)]">Present {record.present} · Absent {record.absent}</div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => startEdit(record)} disabled={isLocked} className={`text-xs ${isLocked ? 'text-[var(--dash-muted)] cursor-not-allowed' : 'text-[var(--dash-accent)]'}`}>Edit</button>
                    <button type="button" onClick={() => handleDelete(record.id)} disabled={isLocked} className={`text-xs ${isLocked ? 'text-[var(--dash-muted)] cursor-not-allowed' : 'text-red-400'}`}>Delete</button>
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

export default Attendance;
