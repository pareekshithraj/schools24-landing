import React, { useState, useEffect } from 'react';
import DashboardShell from '../components/DashboardShell';
import { useAuth } from '../contexts/AuthContext';
import { useCollection } from '../hooks/useCollection';
import { BusRoute, Trip, BusStop } from '../types';
import { startTrip, updateTripStop, completeTrip } from '../services/firestore';
import { where, query, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useToast } from '../components/ToastProvider';
import BusMap from '../components/BusMap';

const DashboardDriver: React.FC = () => {
  const { profile } = useAuth();
  const { push } = useToast();
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [activeRoute, setActiveRoute] = useState<BusRoute | null>(null);
  const [isLoadingTrip, setIsLoadingTrip] = useState(true);

  const { data: routes } = useCollection<BusRoute>('routes', {
    where: profile?.schoolId ? ['schoolId', '==', profile.schoolId] : undefined
  });

  useEffect(() => {
    if (!profile) return;
    const q = query(
      collection(db, 'trips'),
      where('driverId', '==', profile.uid),
      where('status', '==', 'active')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const tripDoc = snapshot.docs[0];
        setActiveTrip({ id: tripDoc.id, ...tripDoc.data() } as Trip);
      } else {
        setActiveTrip(null);
      }
      setIsLoadingTrip(false);
    });
    return () => unsubscribe();
  }, [profile]);

  useEffect(() => {
    if (activeTrip && routes.length > 0) {
      const found = routes.find(r => r.id === activeTrip.routeId);
      if (found) setActiveRoute(found);
    }
  }, [activeTrip, routes]);

  const handleStartTrip = async (route: BusRoute) => {
    if (!profile) return;
    try {
      await startTrip({
        routeId: route.id!,
        driverId: profile.uid,
        schoolId: profile.schoolId,
        date: new Date().toISOString().split('T')[0],
        status: 'active',
        currentStopIndex: -1
      });
      push({ type: 'success', title: 'Trip Started', message: `Safe driving on ${route.name}!` });
    } catch (err: any) {
      push({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleUpdateStop = async (index: number) => {
    if (!activeTrip) return;
    try {
      await updateTripStop(activeTrip.id!, index);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleCompleteTrip = async () => {
    if (!activeTrip) return;
    if (!window.confirm('Are you sure you want to end this trip?')) return;
    try {
      await completeTrip(activeTrip.id!);
      push({ type: 'success', title: 'Trip Completed', message: 'Good job!' });
      setActiveRoute(null);
    } catch (err: any) {
      console.error(err);
    }
  };

  const currentStopIndex = activeTrip?.currentStopIndex ?? -1;
  const nextStop = activeRoute?.stops?.[currentStopIndex + 1];

  // Simulate bus position: If at stop index 1, use Stop 1 coords. If departed, maybe interpolate (keeping simple: snap to stop)
  const currentBusPosition = activeRoute && currentStopIndex >= 0 && activeRoute.stops[currentStopIndex]
    ? { lat: activeRoute.stops[currentStopIndex].lat, lng: activeRoute.stops[currentStopIndex].lng }
    : activeRoute?.stops?.[0] ? { lat: activeRoute.stops[0].lat, lng: activeRoute.stops[0].lng } : undefined;

  return (
    <DashboardShell title="Driver Operations" role="Driver" homePath="/dashboard/driver">
      {isLoadingTrip ? (
        <div>Loading trip status...</div>
      ) : activeTrip && activeRoute ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6 animate-pulse-slow">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-green-600">Live Trip: {activeRoute.name}</h2>
                  <p className="text-sm text-[var(--dash-muted)]">Started at {new Date(activeTrip.lastUpdated.seconds * 1000).toLocaleTimeString()}</p>
                </div>
                <button
                  onClick={handleCompleteTrip}
                  className="rounded-xl bg-red-500 px-6 py-2 font-bold text-white shadow-lg hover:bg-red-600 transition-colors"
                >
                  End Trip
                </button>
              </div>
            </section>

            {/* Map Component */}
            <BusMap stops={activeRoute.stops} currentBusPosition={currentBusPosition} />

            <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
              <h3 className="text-lg font-semibold mb-4">Route Stops</h3>
              <div className="space-y-4">
                {activeRoute.stops?.map((stop, idx) => {
                  const isPassed = idx <= currentStopIndex;
                  const isNext = idx === currentStopIndex + 1;

                  return (
                    <div key={idx} className={`flex items-center justify-between rounded-xl border px-4 py-4 transition-all ${isPassed ? 'border-green-500/20 bg-green-500/5 opacity-70' :
                        isNext ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02] shadow-md' :
                          'border-[var(--dash-border)] bg-[var(--dash-card)]'
                      }`}>
                      <div className="flex items-center gap-4">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${isPassed ? 'bg-green-500 text-white' :
                            isNext ? 'bg-indigo-500 text-white' :
                              'bg-[var(--dash-muted)] text-[var(--dash-panel)]'
                          }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <div className={`font-bold ${isNext ? 'text-indigo-400' : 'text-[var(--dash-text)]'}`}>{stop.name}</div>
                          <div className="text-xs text-[var(--dash-muted)]">{stop.arrivalTime}</div>
                        </div>
                      </div>

                      {isNext && (
                        <button
                          onClick={() => handleUpdateStop(idx)}
                          className="rounded-lg bg-indigo-500 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-600"
                        >
                          Arrived / Depart
                        </button>
                      )}
                      {isPassed && <span className="text-xs font-bold text-green-500">Completed</span>}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6">
              <h3 className="text-lg font-semibold">Current Status</h3>
              <div className="mt-4 text-center">
                <div className="text-sm text-[var(--dash-muted)]">Next Stop</div>
                <div className="text-2xl font-bold text-[var(--dash-text)] mt-1">{nextStop?.name ?? 'End of Route'}</div>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Select a Route to Start</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {routes.map(route => (
              <div key={route.id} className="group relative overflow-hidden rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] p-6 hover:border-[var(--dash-accent)] transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--dash-muted)]">{route.vehicleNo}</div>
                    <h3 className="text-xl font-bold mt-1 group-hover:text-[var(--dash-accent)]">{route.name}</h3>
                    <p className="text-sm text-[var(--dash-muted)] mt-2">{route.stops?.length ?? 0} Stops</p>
                  </div>
                  <button
                    onClick={() => handleStartTrip(route)}
                    className="rounded-full bg-[var(--dash-text)] text-[var(--dash-bg)] px-6 py-2 font-bold hover:bg-[var(--dash-accent)] hover:text-black transition-colors"
                  >
                    Start
                  </button>
                </div>
              </div>
            ))}
            {routes.length === 0 && (
              <div className="col-span-2 text-center py-12 text-[var(--dash-muted)]">
                No routes found assigned to your school. Ask your admin to create one.
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
};

export default DashboardDriver;
