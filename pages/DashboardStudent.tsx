import React, { useState, useEffect } from 'react';
import DashboardShell from '../components/DashboardShell';
import { useAuth } from '../contexts/AuthContext';
import { useCollection } from '../hooks/useCollection';
import { BusRoute, Trip } from '../types';
import { where, query, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import BusMap from '../components/BusMap';

const DashboardStudent: React.FC = () => {
  const { profile } = useAuth();
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [activeRoute, setActiveRoute] = useState<BusRoute | null>(null);

  const { data: routes } = useCollection<BusRoute>('routes', {
    where: profile?.schoolId ? ['schoolId', '==', profile.schoolId] : undefined
  });

  useEffect(() => {
    if (!selectedRouteId) {
      setActiveTrip(null);
      setActiveRoute(null);
      return;
    }

    const route = routes.find(r => r.id === selectedRouteId);
    if (route) setActiveRoute(route);

    const q = query(
      collection(db, 'trips'),
      where('routeId', '==', selectedRouteId),
      where('status', '==', 'active')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const tripData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Trip;
        setActiveTrip(tripData);
      } else {
        setActiveTrip(null);
      }
    });

    return () => unsubscribe();
  }, [selectedRouteId, routes]);

  const currentStopIndex = activeTrip?.currentStopIndex ?? -1;
  const currentBusPosition = activeRoute && currentStopIndex >= 0 && activeRoute.stops[currentStopIndex]
    ? { lat: activeRoute.stops[currentStopIndex].lat, lng: activeRoute.stops[currentStopIndex].lng }
    : activeRoute?.stops?.[0] ? { lat: activeRoute.stops[0].lat, lng: activeRoute.stops[0].lng } : undefined;

  return (
    <DashboardShell title="Student Hub" role="Student" homePath="/dashboard/student">
      <section className="grid gap-6 lg:grid-cols-4">
        {[
          { label: 'Attendance', value: '97%', delta: 'This term' },
          { label: 'Assignments', value: '5', delta: 'Due this week' },
          { label: 'Grades', value: 'A-', delta: 'Current average' },
          { label: 'Announcements', value: '3', delta: 'Unread' },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-5">
            <div className="text-sm text-[var(--dash-muted)]">{card.label}</div>
            <div className="mt-3 text-3xl font-semibold">{card.value}</div>
            <div className="mt-2 text-xs text-[var(--dash-accent)]">{card.delta}</div>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Live Bus Status</h2>
              <select
                className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-3 py-1 text-sm text-[var(--dash-text)]"
                value={selectedRouteId || ''}
                onChange={(e) => setSelectedRouteId(e.target.value || null)}
              >
                <option value="">Select My Route</option>
                {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            {selectedRouteId ? (
              activeTrip ? (
                <div className="space-y-4">
                  <BusMap stops={activeRoute?.stops ?? []} currentBusPosition={currentBusPosition} />
                  <div className="flex items-center gap-2 text-sm text-green-500 font-bold">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    Live on route
                  </div>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-[var(--dash-muted)] border border-dashed border-[var(--dash-border)] rounded-xl">
                  Bus is not active right now.
                </div>
              )
            ) : (
              <div className="h-40 flex items-center justify-center text-[var(--dash-muted)] border border-dashed border-[var(--dash-border)] rounded-xl">
                Select a route to view map.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
            <h2 className="text-lg font-semibold">Today Schedule</h2>
            <div className="mt-6 space-y-4">
              {[
                { name: 'Mathematics', time: '08:15 - 09:00', room: 'Room 21' },
                { name: 'English Literature', time: '09:15 - 10:00', room: 'Room 18' },
                { name: 'Computer Science', time: '11:10 - 11:55', room: 'Lab 3' },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3">
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-[var(--dash-muted)]">{item.time} · {item.room}</div>
                  </div>
                  <button className="text-xs text-[var(--dash-accent)]">Details</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
            <h2 className="text-lg font-semibold">Assignments</h2>
            <div className="mt-6 space-y-3">
              {[
                'Physics Lab Report · Due Thu',
                'History Essay · Due Fri',
                'Math Worksheet · Due Sat',
              ].map((item) => (
                <div key={item} className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] px-4 py-3 text-sm text-[var(--dash-text)]/80">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Fees & Payments</h2>
              <a href="/payments" className="text-sm text-[var(--dash-accent)]">Open Payments</a>
            </div>
            <div className="mt-6 space-y-3">
              <div className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] p-4">
                <div className="text-xs text-[var(--dash-muted)]">Due Amount</div>
                <div className="text-2xl font-semibold mt-2">₹8,500</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
};

export default DashboardStudent;
