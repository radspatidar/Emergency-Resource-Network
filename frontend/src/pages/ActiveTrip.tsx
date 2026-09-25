import React, { useState, useEffect } from 'react';
import { Ambulance, CheckCircle2, Circle, Navigation2, Building2, AlertTriangle, User } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAmbulances, getTripForAmbulance, completeTrip } from '../api/client';

export default function ActiveTrip() {
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
    refetchInterval: 5000
  });

  const completeMutation = useMutation({
    mutationFn: () => completeTrip(trip?.id, { operatorName: currentUser.name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['active-trip'] })
  });

  const emergency = trip?.emergency;

  if (!trip) {
    return (
      <div className="max-w-6xl mx-auto pb-12 pt-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Active Trip</h1>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <Ambulance className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">No Active Trip Found</h2>
          <p className="text-sm text-slate-500 mt-2">You must accept an assignment first to view the active trip details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 pt-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Active Trip Live Tracking</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-800 dark:bg-slate-900 text-white rounded-xl p-5 shadow-sm flex items-center gap-4 border-l-4 border-emerald-500">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Ambulance className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wider mb-1 uppercase">{trip.status === 'In Progress' ? 'EN ROUTE TO DESTINATION' : trip.status}</h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-sm font-bold text-slate-300">{emergency?.requestCode}</span>
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{emergency?.priority}</span>
                <span className="bg-slate-700 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-slate-600">Assigned</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Emergency ID</p>
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{emergency?.requestCode}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Priority</p>
              <span className="inline-block bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{emergency?.priority}</span>
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex flex-shrink-0 items-center justify-center text-blue-500">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Patient Info</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{emergency?.patientName || 'Unknown Patient'} ({emergency?.patientAge || '--'} y/o)</p>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Destination Facility</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-500 flex-shrink-0" /> {trip.hospital?.name || 'Assigned Hospital'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 ml-5">{trip.hospital?.address}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ambulance Details</p>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{trip.ambulance?.vehicleNo}</span>
                <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-800 flex items-center">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1"></span>
                  {trip.ambulance?.status}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Navigation2 className="w-4 h-4 text-blue-500" /> Live GPS Tracking
              </h3>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Live
              </span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/20">
              <div className="relative w-full h-[400px] bg-slate-800 dark:bg-[#0f172a] rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center p-8">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                
                <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider flex items-center gap-1.5 z-10">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  GPS TRACKING ACTIVE
                </div>

                {/* Patient/Destination Marker */}
                <div className="absolute right-[20%] top-[20%] flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-1 border border-blue-500/50">
                    <Building2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-[10px] font-bold text-white tracking-wider bg-black/50 px-2 py-0.5 rounded">DESTINATION</span>
                </div>

                {/* Moving Ambulance Marker */}
                <div 
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 transition-all duration-[2000ms] ease-linear"
                  style={{ 
                    left: `${((trip.currentLng % 0.05) / 0.05) * 80 + 10}%`, 
                    top: `${((trip.currentLat % 0.05) / 0.05) * 80 + 10}%` 
                  }}
                >
                  <div className="text-[10px] text-emerald-400 font-mono mb-1 text-center leading-tight bg-black/60 px-2 py-1 rounded">
                    {trip.currentLat.toFixed(4)}, {trip.currentLng.toFixed(4)}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center mb-1 border-2 border-white shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10">
                    <Ambulance className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-white tracking-wider bg-black/50 px-2 py-0.5 rounded mt-1">VEHICLE</span>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Trip Timeline</h3>
            
            <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-blue-300 before:to-slate-200 dark:before:to-slate-700">
              
              <div className="relative flex items-start gap-4">
                <div className="absolute left-[-24px] w-5 h-5 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Assigned</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Emergency assigned to {trip.ambulance?.vehicleNo}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-1">
                    {new Date(trip.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-4">
                <div className={`absolute left-[-24px] w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center ${trip.acceptedAt ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  {trip.acceptedAt ? <CheckCircle2 className="w-3 h-3 text-white" /> : <Circle className="w-2 h-2 text-slate-400" />}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${trip.acceptedAt ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Accepted</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Operator confirmed</p>
                  {trip.acceptedAt && <p className="text-[10px] font-mono text-slate-400 mt-1">{new Date(trip.acceptedAt).toLocaleTimeString()}</p>}
                </div>
              </div>

              <div className="relative flex items-start gap-4">
                <div className={`absolute left-[-24px] w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center ${trip.startedAt ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  {trip.startedAt ? <CheckCircle2 className="w-3 h-3 text-white" /> : <Circle className="w-2 h-2 text-slate-400" />}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${trip.startedAt ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>In Progress</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Ambulance en route</p>
                  {trip.startedAt && <p className="text-[10px] font-mono text-slate-400 mt-1">{new Date(trip.startedAt).toLocaleTimeString()}</p>}
                </div>
              </div>

              <div className="relative flex items-start gap-4">
                <div className={`absolute left-[-24px] w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center ${trip.completedAt ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  {trip.completedAt ? <CheckCircle2 className="w-3 h-3 text-white" /> : <Circle className="w-2 h-2 text-slate-400" />}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${trip.completedAt ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Completed</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Patient arrived at destination</p>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-900/30">
            <h3 className="text-sm font-bold text-blue-900 dark:text-blue-400 mb-2">Actions</h3>
            <p className="text-xs text-blue-700 dark:text-blue-500 mb-4 leading-relaxed">
              When the patient is safely transferred to the destination hospital, mark this trip as completed.
            </p>
            <button
              onClick={() => completeMutation.mutate()}
              disabled={completeMutation.isPending || trip.status === 'Completed' || trip.status === 'Not Started'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {completeMutation.isPending ? 'Processing...' : 'Complete Trip'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
