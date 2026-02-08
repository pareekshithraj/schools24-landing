import React, { useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import { useAuth } from '../contexts/AuthContext';
import { useSchoolLocks } from '../hooks/useSchoolLocks';
import LockBanner from '../components/LockBanner';
import { createRoute, deleteRecord, updateRecord } from '../services/firestore';
import { useCollection } from '../hooks/useCollection';
import { useToast } from '../components/ToastProvider';
import { BusRoute } from '../types';

interface RouteRecord extends BusRoute {
  id: string; // Ensure ID is present for local use
}

const Transport: React.FC = () => {
  const { profile } = useAuth();
  const isSuperAdmin = profile?.role === 'super_admin';
  const { push } = useToast();
  const { locks } = useSchoolLocks();
  const isLocked = !isSuperAdmin && Boolean(locks.transport);
  const [name, setName] = useState('Route 12');
  const [driver, setDriver] = useState('Arjun Kumar');
  const [vehicle, setVehicle] = useState('Bus KA-01-AA-9023');
  const [stops, setStops] = useState('Sector 9, Lakeview, Central Park');
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<RouteRecord>>({});

  const { data: routes } = useCollection<RouteRecord>('routes', { orderBy: 'createdAt', limit: 6 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setIsSaving(true);
    try {
      // Parse stops string into BusStop objects
      // Format: "Stop Name" OR "Stop Name | lat,lng"
      const stopsListString = stops.split(',').map(s => s.trim()).filter(s => s);
      const stopsData = stopsListString.map((stopStr, index) => {
        const parts = stopStr.split('|');
        const stopName = parts[0].trim();
        let lat = 12.9716; // Default Bangalore
        let lng = 77.5946;

        // Slightly offset defaults so they don't overlap perfectly if no coords provided
        if (parts.length > 1) {
          const coords = parts[1].split(',').map(c => parseFloat(c.trim()));
          if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
            lat = coords[0];
            lng = coords[1];
          }
        } else {
          // Mock offsets for demo if user inputs plain text
          lat += (Math.random() - 0.5) * 0.1;
          lng += (Math.random() - 0.5) * 0.1;
        }

        return {
          id: `stop-${Date.now()}-${index}`,
          name: stopName,
          lat,
          lng,
          arrivalTime: '00:00', // Default
          status: 'pending' as const
        };
      });

      await createRoute({
        name,
        driverName: driver,
        driverId: 'manual-entry',
        vehicleNo: vehicle,
        stops: stopsData,
        schoolId: profile?.schoolId
      });
      push({ type: 'success', title: 'Route created', message: `${name} added.` });
      setName('');
      setDriver('');
      setVehicle('');
      setStops('');
    } catch (err: any) {
      push({ type: 'error', title: 'Create failed', message: err?.message ?? 'Please try again.' });
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (isLocked) return;
    await deleteRecord('routes', id);
  };

  const startEdit = (item: RouteRecord) => {
    setEditingId(item.id!);
    setDraft(item);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = async () => {
    if (!editingId || isLocked) return;
    await updateRecord('routes', editingId, {
      name: draft.name,
      driverName: draft.driverName,
      vehicleNo: draft.vehicleNo,
      // stops: draft.stops // Complex to edit stops in this simple UI, skipping for now or need better UI
    });
    cancelEdit();
  };

  return (
    <DashboardShell title="Transport Operations" role="Driver" homePath="/dashboard/driver">
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Create Route</h2>
          {isLocked && (
            <div className="mt-4">
              <LockBanner
                title="Transport module is locked"
                description="Route updates are disabled until the lock is removed by the super admin."
              />
            </div>
          )}
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-lg">
            Tip: You can add coordinates like "Stop Name | 12.97, 77.59".
            Otherwise, random nearby coordinates will be assigned for the map.
          </div>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Route Name"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm text-[var(--dash-text)]"
              disabled={isLocked}
            />
            <input
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
              placeholder="Driver Name"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm text-[var(--dash-text)]"
              disabled={isLocked}
            />
            <input
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              placeholder="Vehicle No"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm text-[var(--dash-text)]"
              disabled={isLocked}
            />
            <input
              value={stops}
              onChange={(e) => setStops(e.target.value)}
              placeholder="Stops (comma separated)"
              className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-2 text-sm text-[var(--dash-text)]"
              disabled={isLocked}
            />
            <button
              type="submit"
              disabled={isSaving || isLocked}
              className={`md:col-span-2 rounded-lg py-2.5 text-sm font-semibold text-black ${isLocked ? 'bg-[var(--dash-card)] opacity-60 cursor-not-allowed' : 'bg-[var(--dash-accent)]'}`}
            >
              {isSaving ? 'Saving...' : 'Save Route'}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
          <h2 className="text-lg font-semibold">Fleet Status</h2>
          <div className="mt-6 space-y-3">
            {[
              { label: 'Active Vehicles', value: 12 },
              { label: 'In Maintenance', value: 2 },
              { label: 'Drivers On Duty', value: 14 },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3">
                <div className="text-xs text-[var(--dash-muted)]">{item.label}</div>
                <div className="text-2xl font-semibold mt-2">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
        <h2 className="text-lg font-semibold">Active Routes</h2>
        <div className="mt-6 space-y-3">
          {routes.length === 0 && <div className="text-[var(--dash-muted)]">No routes yet.</div>}
          {routes.map((route) => (
            <div key={route.id} className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3">
              {editingId === route.id ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={draft.name ?? ''}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.driverName ?? ''}
                    onChange={(e) => setDraft({ ...draft, driverName: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <input
                    value={draft.vehicleNo ?? ''}
                    onChange={(e) => setDraft({ ...draft, vehicleNo: e.target.value })}
                    className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2 text-sm"
                  />
                  <div className="flex gap-2 md:col-span-2">
                    <button type="button" onClick={saveEdit} disabled={isLocked} className={`rounded-lg px-4 py-2 text-xs font-semibold text-black ${isLocked ? 'bg-[var(--dash-card)] opacity-60 cursor-not-allowed' : 'bg-[var(--dash-accent)]'}`}>Save</button>
                    <button type="button" onClick={cancelEdit} className="rounded-lg border border-[var(--dash-border)] px-4 py-2 text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="font-semibold">{route.name}</div>
                  <div className="text-xs text-[var(--dash-muted)]">Driver: {route.driverName} · {route.vehicleNo}</div>
                  <div className="text-xs text-[var(--dash-muted)]">Stops: {route.stops?.map(s => s.name).join(', ')}</div>
                  <div className="mt-3 flex gap-3">
                    <button type="button" onClick={() => startEdit(route)} className="text-xs text-[var(--dash-accent)]">Edit</button>
                    <button type="button" onClick={() => handleDelete(route.id)} className="text-xs text-red-400">Delete</button>
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

export default Transport;
