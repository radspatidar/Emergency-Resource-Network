import React, { useState } from 'react';
import { Ambulance, AlertTriangle, Activity, MapPin, Building2, User, ChevronRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAmbulances, getTripForAmbulance, acceptTrip, startTrip, completeTrip } from '../api/client';

export default function OperatorDashboard() {
  const [showModal, setShowModal] = useState(false);
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
  ) || ambulances?.find((a: any) => a.status === 'Busy') || ambulances?.[0] || { vehicleNo: currentUser.ambulance, status: 'AVAILABLE', lat: 22.7196, lng: 75.8577 };

  // Fetch trip
  const { data: trip, isLoading } = useQuery({
    queryKey: ['active-trip', myAmbulance?.id],
    queryFn: () => getTripForAmbulance(myAmbulance?.id as string),
    enabled: !!myAmbulance?.id,
    refetchInterval: 5000
  });

  const acceptMutation = useMutation({
    mutationFn: () => acceptTrip(trip?.id, { operatorName: currentUser.name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-trip'] });
      setShowModal(false);
    }
  });

  const startMutation = useMutation({
    mutationFn: () => startTrip(trip?.id, { operatorName: currentUser.name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['active-trip'] })
  });
  
  const completeMutation = useMutation({
    mutationFn: () => completeTrip(trip?.id, { operatorName: currentUser.name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['active-trip'] })
  });

  const emergency = trip?.emergency;
  const hasActiveTrip = !!trip;

  return (
    <div className="max-w-6xl mx-auto pb-12 pt-2">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase flex items-center gap-2">
            AMBULANCE {myAmbulance.vehicleNo}
            <span className={`text-[10px] px-2 py-0.5 rounded-full border tracking-wider flex items-center ${
              myAmbulance.status === 'AVAILABLE' 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 border-orange-200 dark:border-orange-800'
            }`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${myAmbulance.status === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
              {myAmbulance.status.toUpperCase()}
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Emergency Resource Coordination — Operator View</p>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
          <ClockIcon className="w-3.5 h-3.5" />
          Live Tracking Active
        </div>
      </div>

      {/* Top 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <Ambulance className="w-5 h-5 text-slate-400 mb-3" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ambulance Status</p>
            <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-bold mb-1 border ${
              myAmbulance.status === 'AVAILABLE' 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 border-orange-200 dark:border-orange-800'
            }`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${myAmbulance.status === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
              {myAmbulance.status.toUpperCase()}
            </span>
            <p className="text-xs text-slate-500 font-medium">Unit {myAmbulance.vehicleNo}</p>
          </div>
        </div>
        <div className={`bg-white dark:bg-slate-900 rounded-xl p-5 border shadow-sm flex flex-col justify-between relative overflow-hidden ${hasActiveTrip ? 'border-blue-200 dark:border-blue-800/50' : 'border-slate-200 dark:border-slate-800'}`}>
          {hasActiveTrip && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
          <AlertTriangle className={`w-5 h-5 mb-3 ${hasActiveTrip ? 'ml-2 text-blue-500' : 'text-slate-400'}`} />
          <div className={hasActiveTrip ? 'ml-2' : ''}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Assignment</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white font-mono leading-none mb-1">
              {hasActiveTrip ? emergency?.requestCode : 'NONE'}
            </p>
            <p className="text-xs text-slate-500 font-medium">{hasActiveTrip ? 'Active emergency' : 'Standby mode'}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <Activity className="w-5 h-5 text-slate-400 mb-3" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Emergency Priority</p>
            {hasActiveTrip ? (
              <span className="inline-block text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-bold tracking-wider mb-1">
                {emergency?.priority?.toUpperCase() || 'CRITICAL'}
              </span>
            ) : (
              <span className="inline-block text-[10px] bg-slate-100 text-slate-500 dark:bg-slate-800 px-2 py-0.5 rounded font-bold tracking-wider mb-1">
                N/A
              </span>
            )}
            <p className="text-xs text-slate-500 font-medium">{hasActiveTrip ? emergency?.emergencyType : 'No active priority'}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <Ambulance className="w-5 h-5 text-slate-400 mb-3" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Trip Status</p>
            <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold mb-1 border ${
              trip?.status === 'In Progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
              trip?.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
              'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}>
              {trip?.status?.toUpperCase() || 'NOT STARTED'}
            </span>
            <p className="text-xs text-slate-500 font-medium">
              {trip?.status === 'In Progress' ? 'En route to hospital' : 
               trip?.status === 'Accepted' ? 'Preparing to start' : 'Awaiting start'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col */}
        <div className="lg:col-span-2 space-y-6">
          {!hasActiveTrip ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Ambulance className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Active Assignments</h3>
              <p className="text-slate-500 max-w-sm">You currently have no assigned emergencies. Please remain on standby and wait for dispatch instructions.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="bg-red-50/50 dark:bg-red-900/10 p-5 border-b border-red-100 dark:border-red-900/20 flex justify-between items-center relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-red-500 rounded-r-md"></div>
                <div className="ml-3">
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Active Emergency</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{emergency?.requestCode}</p>
                </div>
                <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded tracking-wider">
                  {emergency?.priority?.toUpperCase()}
                </span>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Patient ID</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">{emergency?.patientId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Emergency Type</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{emergency?.emergencyType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Destination</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-blue-500" />
                      Hospital ID: {emergency?.hospitalId?.substring(0,8)}...
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      {emergency?.location}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {trip.status === 'Not Started' && (
                    <button 
                      onClick={() => setShowModal(true)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors"
                    >
                      Accept Assignment
                    </button>
                  )}
                  {trip.status === 'Accepted' && (
                    <button 
                      onClick={() => startMutation.mutate()}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors"
                    >
                      Start Trip
                    </button>
                  )}
                  {trip.status === 'In Progress' && (
                    <button 
                      onClick={() => completeMutation.mutate()}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors"
                    >
                      Complete Trip
                    </button>
                  )}
                  <button className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors">
                    Details
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hidden md:block">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Current Location</h3>
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">SIMULATED</span>
            </div>
            
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Coordinates</p>
            <p className="text-sm font-mono text-slate-700 dark:text-slate-300 font-bold mb-4">{myAmbulance.lat}, {myAmbulance.lng}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Latitude</p>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-400">{myAmbulance.lat}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Longitude</p>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-400">{myAmbulance.lng}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accept Modal */}
      {showModal && hasActiveTrip && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50">
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Accept Emergency Assignment?</h2>
              <p className="text-sm text-slate-500 mb-6">Please confirm that you accept this emergency assignment.</p>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 grid grid-cols-2 gap-y-4 gap-x-4 mb-6 border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Emergency</p>
                  <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{emergency?.requestCode}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Priority</p>
                  <span className="inline-block text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-bold tracking-wider">{emergency?.priority?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Destination</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Assigned Hospital</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ambulance</p>
                  <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{myAmbulance.vehicleNo}</p>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => acceptMutation.mutate()}
                  disabled={acceptMutation.isPending}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition-colors"
                >
                  {acceptMutation.isPending ? 'Accepting...' : 'Accept Assignment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
