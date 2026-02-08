import React, { useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import { useAuth } from '../contexts/AuthContext';
import { useSchoolLocks } from '../hooks/useSchoolLocks';
import LockBanner from '../components/LockBanner';
import { createExam, deleteRecord, updateRecord } from '../services/firestore';
import { useCollection } from '../hooks/useCollection';
import { useToast } from '../components/ToastProvider';

interface ExamRecord {
  id: string;
  title: string;
  subject: string;
  date: string;
  grade: string;
}

const Exams: React.FC = () => {
  const { profile } = useAuth();
  const isSuperAdmin = profile?.role === 'super_admin';
  const { push } = useToast();
  const { locks } = useSchoolLocks();
  const isLocked = !isSuperAdmin && Boolean(locks.academics);
  const [title, setTitle] = useState('Unit Test 2');
  const [subject, setSubject] = useState('Mathematics');
  const [date, setDate] = useState('2026-02-20');
  const [grade, setGrade] = useState('Grade 8');
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<ExamRecord>>({});

  const { data: exams } = useCollection<ExamRecord>('exams', { orderBy: 'createdAt', limit: 6 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setIsSaving(true);
    try {
      await createExam({ title, subject, date, grade, schoolId: profile?.schoolId });
      push({ type: 'success', title: 'Exam created', message: `${title} scheduled.` });
    } catch (err: any) {
      push({ type: 'error', title: 'Create failed', message: err?.message ?? 'Please try again.' });
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (isLocked) return;
    await deleteRecord('exams', id);
  };

  const startEdit = (item: ExamRecord) => {
    setEditingId(item.id);
    setDraft(item);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = async () => {
    if (!editingId || isLocked) return;
    await updateRecord('exams', editingId, {
      title: draft.title,
      subject: draft.subject,
      date: draft.date,
      grade: draft.grade,
    });
    cancelEdit();
  };

  return (
    <DashboardShell title="Exams & Assignments" role="Teacher" homePath="/dashboard/teacher">
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Create Exam</h2>
          {isLocked && (
            <div className="mt-4">
              <LockBanner
                title="Academics module is locked"
                description="Exam scheduling is disabled until the lock is removed by the super admin."
              />
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Exam Title"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              disabled={isLocked}
            />
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
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
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Grade"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
              disabled={isLocked}
            />
            <button
              type="submit"
              disabled={isSaving || isLocked}
              className={`md:col-span-2 rounded-lg py-2.5 text-sm font-semibold text-black ${isLocked ? 'bg-[var(--dash-card)] opacity-60 cursor-not-allowed' : 'bg-[var(--dash-accent)]'}`}
            >
              {isSaving ? 'Saving...' : 'Schedule Exam'}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Assignments Queue</h2>
          <div className="mt-6 space-y-3">
            {['Homework 4', 'Lab Report', 'Project Draft'].map((item) => (
              <div key={item} className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
        <h2 className="text-lg font-semibold">Upcoming Exams</h2>
        <div className="mt-6 space-y-3">
          {exams.length === 0 && <div className="text-[var(--dash-muted)]">No exams scheduled.</div>}
          {exams.map((exam) => (
            <div key={exam.id} className="flex flex-col gap-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3">
              {editingId === exam.id ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={draft.title ?? ''}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.subject ?? ''}
                    onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.date ?? ''}
                    onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                    type="date"
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.grade ?? ''}
                    onChange={(e) => setDraft({ ...draft, grade: e.target.value })}
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
                    <div className="font-semibold">{exam.title}</div>
                    <div className="text-xs text-[var(--dash-muted)]">{exam.subject} · {exam.grade}</div>
                  </div>
                  <div className="text-xs text-[var(--dash-muted)]">{exam.date}</div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => startEdit(exam)} className="text-xs text-[var(--dash-accent)]">Edit</button>
                    <button type="button" onClick={() => handleDelete(exam.id)} className="text-xs text-red-400">Delete</button>
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

export default Exams;
