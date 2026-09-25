import React, { useState, useEffect } from 'react';
import { Navigation2, MapPin, RefreshCw, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAmbulances, getTripForAmbulance, updateTripLocation } from '../api/client';

export default function Location() {
  const [position, setPosition] = useState<{lat: number, lng: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : { ambulance: 'A-001', name: 'Operator' };

  // Fetch ambulances to find ID
  const { data: ambulances } = useQuery({
    queryKey: ['ambulances'],
    queryFn: () => getAmbulances(),
  });

  const myAmbulance = ambulances?.find((a: any) => 
    a.vehicleNo?.replace('-', '') === currentUser.ambulance?.replace('-', '') || a.id === currentUser.ambulance
  ) || ambulances?.find((a: any) => a.status === 'Busy') || ambulances?.[0];

  // Fetch trip
  const { data: trip } = useQuery({
    queryKey: ['active-trip', myAmbulance?.id],
    queryFn: () => getTripForAmbulance(myAmbulance?.id as string),
    enabled: !!myAmbulance?.id,
    refetchInterval: 10000
  });

  const updateLocationMutation = useMutation({
    mutationFn: (data: {lat: number, lng: number}) => 
      updateTripLocation(trip?.id, { ...data, waypointIndex: 0 })
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(newPos);
        setLastUpdated(new Date());
        setError(null);

        // If we have an active trip, update backend
        if (trip && trip.status === 'In Progress') {
          updateLocationMutation.mutate(newPos);
        }
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    setWatchId(id);

    return () => {
      if (id !== null) {
        navigator.geolocation.clearWatch(id);
      }
    };
  }, [trip?.status, trip?.id]);

  const destLat = trip?.hospital ? 22.7265 : null;
  const destLng = trip?.hospital ? 75.8650 : null;

  return (
    <div className="max-w-6xl mx-auto pb-12 pt-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Live Location</h1>
      </div>

      <div className="mb-6">
        {error ? (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-900/50">
            <AlertTriangle className="w-5 h-5" />
            <p className="text-sm font-medium">GPS Error: {error}</p>
          </div>
        ) : (
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-500 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-time GPS tracking active
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center">
                <Navigation2 className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">Current Coordinates</span>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Latitude</p>
                <p className="text-3xl font-mono font-bold text-slate-900 dark:text-white leading-none">
                  {position ? position.lat.toFixed(6) : '--.------'}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Longitude</p>
                <p className="text-3xl font-mono font-bold text-slate-900 dark:text-white leading-none">
                  {position ? position.lng.toFixed(6) : '--.------'}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Last Updated</p>
                <p className="text-sm font-mono text-slate-600 dark:text-slate-400 font-medium">
                  {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Waiting for signal...'}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {trip ? (trip.status === 'In Progress' ? 'En Route to Destination' : trip.status) : 'Standby'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Location Visualization</h3>
            
            <div className="relative w-full h-[400px] bg-slate-800 dark:bg-[#0f172a] rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center p-8 mb-6">
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              
              {/* Badge */}
              <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider flex items-center gap-1.5 z-10">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                LIVE GPS
              </div>
              
              {/* Marker - Center it dynamically based on position */}
              {position && (
                <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="text-[10px] text-slate-400 font-mono mb-1 text-center leading-tight">
                    {position.lat.toFixed(4)}<br/>{position.lng.toFixed(4)}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mb-1">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-lg"></div>
                  </div>
                  <span className="text-[10px] font-bold text-white tracking-wider">CURRENT</span>
                </div>
              )}

              {!position && !error && (
                <div className="text-slate-400 font-mono text-sm animate-pulse">
                  Acquiring GPS satellite fix...
                </div>
              )}
            </div>

            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Trip Information</h3>
            
            <div className="space-y-3">
              {/* Start/Current */}
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold"><MapPin className="w-3 h-3" /></span>
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    {position ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : 'Waiting...'}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">YOUR LOCATION</span>
                </div>
              </div>

              {trip && (
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-3 flex items-center justify-between opacity-90">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-xs font-bold">D</span>
                    <div>
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-white block">{trip.hospital?.name || 'Destination'}</span>
                      <span className="text-xs text-slate-500">{trip.hospital?.address}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-500 text-[10px] font-bold px-2 py-0.5 rounded">DESTINATION</span>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
