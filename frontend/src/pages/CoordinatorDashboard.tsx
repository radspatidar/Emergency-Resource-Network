import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Plus, ArrowRight, Ambulance, Building2, ChevronRight, Activity, Clock } from 'lucide-react';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { getEmergencies } from '../api/client';

export default function CoordinatorDashboard() {
  const navigate = useNavigate();

  const { data: emergenciesData = [], isLoading } = useQuery({
    queryKey: ['emergencies'],
    queryFn: () => getEmergencies(),
    refetchInterval: 5000,
  });

  const metrics = [
    { label: 'ACTIVE', value: '7', color: 'text-gray-900 dark:text-white', border: 'border-gray-200 dark:border-slate-800' },
    { label: 'CRITICAL', value: '3', color: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/10' },
    { label: 'HIGH', value: '3', color: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/10' },
    { label: 'MEDIUM', value: '1', color: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-900/40 bg-yellow-50/30 dark:bg-yellow-950/10' },
    { label: 'PENDING', value: '3', color: 'text-gray-900 dark:text-white', border: 'border-gray-200 dark:border-slate-800' },
    { label: 'ASSIGNED', value: '2', color: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-900/40' },
    { label: 'IN PROGRESS', value: '2', color: 'text-teal-600 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-900/40' },
    { label: 'AMBULANCES AVAIL.', value: '7', color: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-900/40' },
  ];

  const activeRequests = emergenciesData.map((req: any) => ({
    id: req.requestCode,
    type: req.emergencyType,
    priority: req.priority.toUpperCase(),
    location: req.location,
    resources: req.requiredResources || [],
    hospital: req.hospital?.name || req.hospitalId || '—',
    amb: req.trip?.ambulance?.vehicleNo || req.ambulance?.vehicleNo || req.ambulanceId || '—',
    status: req.status.toUpperCase(),
    time: new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  })).slice(0, 10); // Show top 10

  const pendingRequests = activeRequests.filter((r: any) => r.status === 'PENDING');
  const criticalPending = pendingRequests.filter((r: any) => r.priority === 'CRITICAL').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Emergency Operations</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Monitor active emergencies and coordinate available healthcare resources.</p>
        </div>
        <button
          onClick={() => navigate('/emergency-requests/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Emergency
        </button>
      </div>

      {/* Critical Alert Banner */}
      {criticalPending > 0 && (
        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/70 dark:bg-red-950/20 text-red-700 dark:text-red-400 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
            <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">!</span>
            <span>{criticalPending} critical emergencies pending assignment — immediate coordination required.</span>
          </div>
          <button 
            onClick={() => navigate('/emergency-requests')}
            className="px-3 py-1 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors shadow-2xs whitespace-nowrap"
          >
            View All
          </button>
        </div>
      )}

      {/* Priority Summary Metrics Bar (8 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {metrics.map((m, idx) => (
          <div key={idx} className={clsx("p-3.5 rounded-xl border bg-white dark:bg-slate-850 text-left shadow-2xs", m.border)}>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{m.label}</p>
            <p className={clsx("text-xl font-bold mt-1", m.color)}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Main Split Content: Active Emergency Requests Table (Left 2/3) & Quick Actions / Fleet Status (Right 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Active Emergency Requests Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-850 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-0">
          <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Active Emergency Requests</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">{activeRequests.length}</span>
            </div>
            <Link to="/emergency-requests" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">REQUEST</th>
                  <th className="px-4 py-3">TYPE</th>
                  <th className="px-4 py-3">PRIORITY</th>
                  <th className="px-4 py-3">LOCATION</th>
                  <th className="px-4 py-3">RESOURCES</th>
                  <th className="px-4 py-3">HOSPITAL</th>
                  <th className="px-4 py-3">AMB.</th>
                  <th className="px-4 py-3">STATUS</th>
                  <th className="px-4 py-3">TIME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60 text-xs">
                {activeRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    {/* Request ID */}
                    <td className="px-4 py-3.5 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {req.id}
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3.5 font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                      {req.type}
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={clsx(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                        req.priority === 'CRITICAL' && "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400",
                        req.priority === 'HIGH' && "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400",
                        req.priority === 'MEDIUM' && "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400"
                      )}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {req.priority}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {req.location}
                    </td>

                    {/* Resources */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex gap-1">
                        {req.resources.map((r, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-gray-100 dark:bg-slate-800 text-gray-500 border border-gray-200 dark:border-slate-700">
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Hospital */}
                    <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {req.hospital}
                    </td>

                    {/* Ambulance */}
                    <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400 whitespace-nowrap font-mono text-[11px]">
                      {req.amb}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={clsx(
                        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase",
                        req.status === 'PENDING' && "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700",
                        req.status === 'IN PROGRESS' && "bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-900/40",
                        req.status === 'ASSIGNED' && "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40"
                      )}>
                        {req.status}
                      </span>
                    </td>

                    {/* Time */}
                    <td className="px-4 py-3.5 text-gray-400 font-mono text-[11px] whitespace-nowrap">
                      {req.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Needs Action, Ambulance Fleet, Hospital Network */}
        <div className="space-y-5">

          {/* Needs Action Box */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl p-4 border border-gray-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Needs Action</h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                {pendingRequests.length} pending
              </span>
            </div>

            <div className="space-y-2.5">
              {pendingRequests.slice(0, 3).map((req: any) => (
                <div key={req.id} className="p-3 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-950/10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-red-600 dark:text-red-400">{req.id}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-gray-200 dark:bg-slate-800 text-gray-600">PENDING</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-1">{req.type}</p>
                    <p className="text-[10px] text-gray-400">{req.location}</p>
                  </div>
                  <button 
                    onClick={() => navigate('/emergency-requests')}
                    className="px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 text-xs font-bold rounded-lg transition-colors"
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Ambulance Fleet Box */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl p-4 border border-gray-200 dark:border-slate-800 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Ambulance Fleet</h4>
            
            <div className="grid grid-cols-3 gap-2 text-center bg-gray-50/70 dark:bg-slate-900/50 p-3 rounded-xl">
              <div>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">7</p>
                <p className="text-[10px] text-gray-400 font-semibold">Available</p>
              </div>
              <div>
                <p className="text-lg font-bold text-amber-500">4</p>
                <p className="text-[10px] text-gray-400 font-semibold">Busy</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">11</p>
                <p className="text-[10px] text-gray-400 font-semibold">Total</p>
              </div>
            </div>

            <button 
              onClick={() => navigate('/ambulances')}
              className="w-full py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline border border-blue-100 dark:border-slate-800 rounded-xl flex items-center justify-center gap-1"
            >
              Open Monitoring →
            </button>
          </div>

          {/* Hospital Network Box */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl p-4 border border-gray-200 dark:border-slate-800 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Hospital Network</h4>

            <div className="grid grid-cols-3 gap-2 text-center bg-gray-50/70 dark:bg-slate-900/50 p-3 rounded-xl">
              <div>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">4</p>
                <p className="text-[10px] text-gray-400 font-semibold">Available</p>
              </div>
              <div>
                <p className="text-lg font-bold text-amber-500">1</p>
                <p className="text-[10px] text-gray-400 font-semibold">Busy</p>
              </div>
              <div>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">1</p>
                <p className="text-[10px] text-gray-400 font-semibold">Full</p>
              </div>
            </div>

            {/* Alert banner */}
            <div className="p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <span>⚠️</span>
              <span>Apollo Emergency: 2 ICU remaining</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
