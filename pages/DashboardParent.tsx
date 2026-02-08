import React, { useState, useEffect } from 'react';
import DashboardShell from '../components/DashboardShell';
import { useAuth } from '../contexts/AuthContext';
import { useCollection } from '../hooks/useCollection';
import { BusRoute, Trip } from '../types';
import { where, query, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useToast } from '../components/ToastProvider';
import BusMap from '../components/BusMap';

const DashboardParent: React.FC = () => {
  const { profile } = useAuth();
  const { push } = useToast();
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [activeRoute, setActiveRoute] = useState<BusRoute | null>(null);

  // Fetch all routes for the school so parent can select "My Bus"
  const { data: routes } = useCollection<BusRoute>('routes', {
    where: profile?.schoolId ? ['schoolId', '==', profile.schoolId] : undefined
  });

  // Listen to trip updates
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
        setActiveTrip(prev => {
          // Check for notification condition
          if (prev && prev.id === tripData.id && tripData.currentStopIndex > prev.currentStopIndex) {
            const departedStop = route?.stops[tripData.currentStopIndex];
            if (departedStop) {
              push({
                type: 'info',
                title: 'Bus Update',
                message: `Bus has departed ${departedStop.name}. Track live!`
              });
            }
          }
          return tripData;
        });
      } else {
        setActiveTrip(null);
      }
    });

    return () => unsubscribe();
  }, [selectedRouteId, routes, push]);

  // Calculate Bus Position
  const currentStopIndex = activeTrip?.currentStopIndex ?? -1;
  const currentBusPosition = activeRoute && currentStopIndex >= 0 && activeRoute.stops[currentStopIndex]
    ? { lat: activeRoute.stops[currentStopIndex].lat, lng: activeRoute.stops[currentStopIndex].lng }
    : activeRoute?.stops?.[0] ? { lat: activeRoute.stops[0].lat, lng: activeRoute.stops[0].lng } : undefined;

  return (
    <DashboardShell title="My Kids" role="Parent" homePath="/dashboard/parent">
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Bus Tracking Section */}
          <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Live Bus Tracking</h2>
              <select
                className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-3 py-1 text-sm text-[var(--dash-text)]"
                value={selectedRouteId || ''}
                onChange={(e) => setSelectedRouteId(e.target.value || null)}
              >
                <option value="">Select Bus Route</option>
                {routes.map(r => <option key={r.id} value={r.id}>{r.name} ({r.vehicleNo})</option>)}
              </select>
            </div>

            {selectedRouteId ? (
              activeTrip && activeRoute ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 rounded-xl bg-green-500/10 border border-green-500/20 p-4">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                    <div>
                      <div className="font-bold text-green-600">Bus is Live</div>
                      <div className="text-xs text-[var(--dash-muted)]">
                        Last updated: {new Date(activeTrip.lastUpdated?.seconds * 1000).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  {/* MAP */}
                  <BusMap stops={activeRoute.stops} currentBusPosition={currentBusPosition} />

                  {/* Visual Route Timeline */}
                  <div className="relative pl-4 space-y-8 border-l-2 border-[var(--dash-border)] ml-2">
                    {activeRoute.stops.map((stop, idx) => {
                      const isPassed = idx <= activeTrip.currentStopIndex;
                      const isNext = idx === activeTrip.currentStopIndex + 1;

                      return (
                        <div key={idx} className="relative">
                          <div className={`absolute -left-[21px] top-1 h-4 w-4 rounded-full border-2 ${isPassed ? 'border-green-500 bg-green-500' :
                              isNext ? 'border-indigo-500 bg-[var(--dash-bg)]' :
                                'border-[var(--dash-muted)]/30 bg-[var(--dash-bg)]'
                            }`}></div>

                          <div className={`${isPassed ? 'opacity-50' : 'opacity-100'}`}>
                            <div className="font-bold text-sm">{stop.name}</div>
                            <div className="text-xs text-[var(--dash-muted)]">Scheduled: {stop.arrivalTime}</div>
                            {isNext && (
                              <div className="mt-2 inline-block rounded bg-indigo-500 px-2 py-1 text-[10px] font-bold text-white">
                                NEXT STOP
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-[var(--dash-muted)]">
                  Bus is currently not active or trip hasn't started.
                </div>
              )
            ) : (
              <div className="text-center py-12 text-[var(--dash-muted)]">
                Select a route to view status.
              </div>
            )}
          </div>
        </div>

        {/* Notifications & Quick Stats */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
            <h2 className="text-lg font-semibold">Attendance</h2>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] p-4">
              <div>
                <div className="text-xs text-[var(--dash-muted)]">Today</div>
                <div className="font-bold text-green-500">Present</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[var(--dash-muted)]">Check-in</div>
                <div className="font-bold">08:15 AM</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
            <h2 className="text-lg font-semibold">Notices</h2>
            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-lg bg-[var(--dash-card)] text-sm border-l-4 border-yellow-500">
                School closes early on Friday (2 PM).
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
};

export default DashboardParent;
