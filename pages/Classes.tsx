import React, { useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import { useAuth } from '../contexts/AuthContext';
import { useSchoolLocks } from '../hooks/useSchoolLocks';
import LockBanner from '../components/LockBanner';
import { createClass, deleteRecord, updateRecord } from '../services/firestore';
import { useCollection } from '../hooks/useCollection';
import { useToast } from '../components/ToastProvider';

interface ClassRecord {
  id: string;
  grade: string;
  section: string;
  teacher: string;
  room: string;
}

const Classes: React.FC = () => {
  const { profile } = useAuth();
  const isSuperAdmin = profile?.role === 'super_admin';
  const { push } = useToast();
  const { locks } = useSchoolLocks();
  const isLocked = !isSuperAdmin && Boolean(locks.academics);
  const [grade, setGrade] = useState('Grade 6');
  const [section, setSection] = useState('A');
  const [teacher, setTeacher] = useState('');
  const [room, setRoom] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<ClassRecord>>({});

  const { data: classes } = useCollection<ClassRecord>('classes', { orderBy: 'createdAt', limit: 8 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setIsSaving(true);
    try {
      await createClass({ grade, section, teacher, room, schoolId: profile?.schoolId });
      push({ type: 'success', title: 'Class created', message: `${grade} - ${section} added.` });
    } catch (err: any) {
      push({ type: 'error', title: 'Create failed', message: err?.message ?? 'Please try again.' });
    }
    setTeacher('');
    setRoom('');
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    await deleteRecord('classes', id);
  };

  const startEdit = (item: ClassRecord) => {
    setEditingId(item.id);
    setDraft(item);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = async () => {
    if (!editingId || isLocked) return;
    await updateRecord('classes', editingId, {
      grade: draft.grade,
      section: draft.section,
      teacher: draft.teacher,
      room: draft.room,
    });
    cancelEdit();
  };

  return (
    <DashboardShell title="Classes & Timetable" role="Admin" homePath="/dashboard/admin">
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Create Class</h2>
          {isLocked && (
            <div className="mt-4">
              <LockBanner
                title="Academics module is locked"
                description="Class creation is disabled until the lock is removed by the super admin."
              />
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              disabled={isLocked}
            >
              {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <input
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="Section"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              disabled={isLocked}
            />
            <input
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              placeholder="Class Teacher"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              disabled={isLocked}
            />
            <input
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Room"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              disabled={isLocked}
            />
            <button
              type="submit"
              disabled={isSaving || isLocked}
              className={`md:col-span-2 rounded-lg py-2.5 text-sm font-semibold text-black ${isLocked ? 'bg-[var(--dash-card)] opacity-60 cursor-not-allowed' : 'bg-[var(--dash-accent)]'}`}
            >
              {isSaving ? 'Saving...' : 'Add Class'}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Timetable Focus</h2>
          <div className="mt-6 space-y-3 text-sm">
            {['Maths', 'Science', 'English', 'Social', 'Computer'].map((subject) => (
              <div key={subject} className="flex items-center justify-between rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3">
                <span>{subject}</span>
                <span className="text-[var(--dash-muted)]">{Math.floor(Math.random() * 6) + 3} periods</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
        <h2 className="text-lg font-semibold">Active Classes</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {classes.length === 0 && <div className="text-[var(--dash-muted)]">No classes yet.</div>}
          {classes.map((item) => (
            <div key={item.id} className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] p-4">
              {editingId === item.id ? (
                <div className="grid gap-3">
                  <input
                    value={draft.grade ?? ''}
                    onChange={(e) => setDraft({ ...draft, grade: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.section ?? ''}
                    onChange={(e) => setDraft({ ...draft, section: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.teacher ?? ''}
                    onChange={(e) => setDraft({ ...draft, teacher: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.room ?? ''}
                    onChange={(e) => setDraft({ ...draft, room: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={saveEdit} disabled={isLocked} className={`rounded-lg px-4 py-2 text-xs font-semibold text-black ${isLocked ? 'bg-[var(--dash-card)] opacity-60 cursor-not-allowed' : 'bg-[var(--dash-accent)]'}`}>Save</button>
                    <button type="button" onClick={cancelEdit} className="rounded-lg border border-[var(--dash-border)] px-4 py-2 text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-xs text-[var(--dash-muted)]">{item.grade} · Section {item.section}</div>
                  <div className="text-lg font-semibold mt-2">{item.teacher || 'Unassigned Teacher'}</div>
                  <div className="text-xs text-[var(--dash-muted)] mt-2">Room: {item.room || 'TBD'}</div>
                  <div className="mt-4 flex gap-3">
                    <button type="button" onClick={() => startEdit(item)} disabled={isLocked} className={`text-xs ${isLocked ? 'text-[var(--dash-muted)] cursor-not-allowed' : 'text-[var(--dash-accent)]'}`}>Edit</button>
                    <button type="button" onClick={() => handleDelete(item.id)} disabled={isLocked} className={`text-xs ${isLocked ? 'text-[var(--dash-muted)] cursor-not-allowed' : 'text-red-400'}`}>Delete</button>
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

export default Classes;
