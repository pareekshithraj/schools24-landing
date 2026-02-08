import React, { useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import { useAuth } from '../contexts/AuthContext';
import { createInventoryItem, deleteRecord, updateRecord } from '../services/firestore';
import { useCollection } from '../hooks/useCollection';
import { useToast } from '../components/ToastProvider';

interface InventoryRecord {
  id: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
}

const Inventory: React.FC = () => {
  const { profile } = useAuth();
  const { push } = useToast();
  const [name, setName] = useState('Lab Microscope');
  const [category, setCategory] = useState('Science Lab');
  const [quantity, setQuantity] = useState(12);
  const [location, setLocation] = useState('Block B');
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<InventoryRecord>>({});

  const { data: items } = useCollection<InventoryRecord>('inventory', { orderBy: 'createdAt', limit: 8 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await createInventoryItem({ name, category, quantity, location, schoolId: profile?.schoolId });
      push({ type: 'success', title: 'Item added', message: `${name} saved.` });
    } catch (err: any) {
      push({ type: 'error', title: 'Create failed', message: err?.message ?? 'Please try again.' });
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    await deleteRecord('inventory', id);
  };

  const startEdit = (item: InventoryRecord) => {
    setEditingId(item.id);
    setDraft(item);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updateRecord('inventory', editingId, {
      name: draft.name,
      category: draft.category,
      quantity: draft.quantity,
      location: draft.location,
    });
    cancelEdit();
  };

  return (
    <DashboardShell title="Inventory & Assets" role="Admin" homePath="/dashboard/admin">
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Add Inventory</h2>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Item Name"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
            />
            <input
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              type="number"
              placeholder="Quantity"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
            />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={isSaving}
              className="md:col-span-2 rounded-lg bg-[var(--dash-accent)] py-2.5 text-sm font-semibold text-black"
            >
              {isSaving ? 'Saving...' : 'Save Item'}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Stock Alerts</h2>
          <div className="mt-6 space-y-3">
            {['Printer Ink', 'Science Kit', 'Projectors'].map((item) => (
              <div key={item} className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3 text-sm">
                {item} · Low Stock
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
        <h2 className="text-lg font-semibold">Inventory List</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.length === 0 && <div className="text-[var(--dash-muted)]">No inventory records yet.</div>}
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] p-4">
              {editingId === item.id ? (
                <div className="grid gap-3">
                  <input
                    value={draft.name ?? ''}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.category ?? ''}
                    onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.quantity ?? 0}
                    onChange={(e) => setDraft({ ...draft, quantity: Number(e.target.value) })}
                    type="number"
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.location ?? ''}
                    onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={saveEdit} className="rounded-lg bg-[var(--dash-accent)] px-4 py-2 text-xs font-semibold text-black">Save</button>
                    <button type="button" onClick={cancelEdit} className="rounded-lg border border-[var(--dash-border)] px-4 py-2 text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-xs text-[var(--dash-muted)]">{item.category}</div>
                  <div className="text-lg font-semibold mt-2">{item.name}</div>
                  <div className="text-xs text-[var(--dash-muted)] mt-2">Qty: {item.quantity} · {item.location}</div>
                  <div className="mt-4 flex gap-3">
                    <button type="button" onClick={() => startEdit(item)} className="text-xs text-[var(--dash-accent)]">Edit</button>
                    <button type="button" onClick={() => handleDelete(item.id)} className="text-xs text-red-400">Delete</button>
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

export default Inventory;
