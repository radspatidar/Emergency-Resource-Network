import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getHospitals, getAmbulances, getEmergencies } from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function Monitoring() {
  const navigate = useNavigate();

  const { data: rawHospitals = [] } = useQuery({ queryKey: ['hospitals'], queryFn: () => getHospitals(), refetchInterval: 5000 });
  const { data: rawAmbulances = [] } = useQuery({ queryKey: ['ambulances'], queryFn: () => getAmbulances(), refetchInterval: 5000 });
  const { data: rawEmergencies = [] } = useQuery({ queryKey: ['emergencies'], queryFn: () => getEmergencies(), refetchInterval: 5000 });

  const hospitals = rawHospitals.map((h: any) => ({
    name: h.name,
    icu: h.availableIcu,
    beds: h.availableBeds,
    vents: h.availableVentilators,
    dr: h.doctorsAvailable,
    status: h.emergencyStatus.toUpperCase(),
    time: 'Live'
  }));

  const ambulances = rawAmbulances.map((a: any) => ({
    id: a.vehicleNo,
    status: a.status.toUpperCase(),
    lat: `${a.lat.toFixed(3)}, ${a.lng.toFixed(3)}`,
    time: 'Live'
  }));

  const emergencies = rawEmergencies.map((req: any) => ({
    id: req.requestCode,
    priority: req.priority.toUpperCase(),
    desc: req.emergencyType,
    loc: req.location,
    time: new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: req.status.toUpperCase(),
    hosp: req.hospital?.name || req.hospitalId || '—',
    amb: req.ambulance?.vehicleNo || req.ambulanceId || '—',
    dbId: req.id
  }));
  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800/60';
      case 'BUSY': return 'text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800/60';
      case 'FULL': return 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800/60';
      case 'OFFLINE': return 'text-slate-500 bg-slate-100 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50';
      case 'HIGH': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500 dark:border-yellow-800/50';
      case 'MEDIUM': return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50';
      default: return '';
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-16">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Operational Monitoring</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">System-wide picture — hospitals, ambulances, and active emergencies.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Hospital Network */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Hospital Network</h2>
              <span className="text-[10px] text-slate-400 font-medium">Updated just now</span>
            </div>
            
            <div className="grid grid-cols-4 divide-x divide-slate-100 dark:divide-slate-800 border-b border-slate-100 dark:border-slate-800">
              <div className="p-3 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">TOTAL</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">{hospitals.length}</div>
              </div>
              <div className="p-3 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">AVAILABLE</div>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-500">{hospitals.filter((h:any) => h.status === 'AVAILABLE').length}</div>
              </div>
              <div className="p-3 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">BUSY</div>
                <div className="text-xl font-bold text-orange-500">{hospitals.filter((h:any) => h.status === 'BUSY').length}</div>
              </div>
              <div className="p-3 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">FULL</div>
                <div className="text-xl font-bold text-red-500">{hospitals.filter((h:any) => h.status === 'FULL').length}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800 border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10">
              <div className="p-2 text-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
                <span className="text-blue-600 dark:text-blue-400 text-sm">{hospitals.reduce((acc: number, h: any) => acc + h.icu, 0)}</span> ICU AVAIL
              </div>
              <div className="p-2 text-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
                <span className="text-blue-600 dark:text-blue-400 text-sm">{hospitals.reduce((acc: number, h: any) => acc + h.beds, 0)}</span> BEDS AVAIL
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[400px] overflow-y-auto">
              {hospitals.map(h => (
                <div key={h.name} className="p-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">{h.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono tracking-tight">
                      ICU:{h.icu} Beds:{h.beds} Vents:{h.vents} Dr:{h.dr}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wide mb-1 ${getBadgeColor(h.status)}`}>
                      {h.status}
                    </span>
                    <div className="text-[9px] text-slate-400">{h.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ambulance Fleet */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Ambulance Fleet</h2>
            </div>
            
            <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 border-b border-slate-100 dark:border-slate-800">
              <div className="p-3 text-center">
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-500 mb-1">{ambulances.filter((a: any) => a.status === 'AVAILABLE').length}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AVAILABLE</div>
              </div>
              <div className="p-3 text-center">
                <div className="text-xl font-bold text-orange-500 mb-1">{ambulances.filter((a: any) => a.status === 'BUSY' || a.status === 'IN PROGRESS').length}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">BUSY</div>
              </div>
              <div className="p-3 text-center">
                <div className="text-xl font-bold text-slate-900 dark:text-white mb-1">{ambulances.length}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">TOTAL ACTIVE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Resource Alerts */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-yellow-600 dark:text-yellow-500">⚠️</span> Resource Alerts <span className="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-500 text-[10px]">3</span>
              </h2>
              <span className="text-xs text-slate-400">Informational only — contact hospital to update</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800/50">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-yellow-200 text-yellow-800 dark:bg-yellow-800/60 dark:text-yellow-300 tracking-wider">WARNING</span>
                <span className="text-xs text-slate-700 dark:text-slate-300"><span className="font-semibold text-slate-900 dark:text-white">Apollo Emergency Center:</span> Only 2 ICU beds remaining.</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800/50">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-200 text-red-800 dark:bg-red-800/60 dark:text-red-300 tracking-wider">CRITICAL</span>
                <span className="text-xs text-slate-700 dark:text-slate-300"><span className="font-semibold text-slate-900 dark:text-white">Central Hospital:</span> No ventilators available.</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-800/50">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-yellow-200 text-yellow-800 dark:bg-yellow-800/60 dark:text-yellow-300 tracking-wider">WARNING</span>
                <span className="text-xs text-slate-700 dark:text-slate-300"><span className="font-semibold text-slate-900 dark:text-white">Apollo Emergency Center:</span> Only 1 ventilator remaining.</span>
              </div>
            </div>
          </div>

          {/* Active Emergency Board */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Active Emergency Board</h2>
            
            <div className="space-y-6">
              {/* PENDING */}
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">PENDING ({emergencies.filter((e: any) => e.status === 'PENDING').length})</h3>
                <div className="space-y-1">
                  {emergencies.filter((e: any) => e.status === 'PENDING').map((e: any) => (
                    <div key={e.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 px-2 rounded -mx-2 transition-colors">
                      <div className="flex items-center gap-4 w-[40%]">
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 w-16">{e.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider w-20 text-center ${getPriorityColor(e.priority)}`}>
                          {e.priority === 'CRITICAL' ? '● ' : e.priority === 'HIGH' ? '▲ ' : ''}{e.priority}
                        </span>
                        <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{e.desc}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-mono justify-end flex-1">
                        <span className="text-right">{e.loc}</span>
                        <span className="w-20 text-right">{e.time}</span>
                        <button onClick={() => navigate(`/resource-matching?id=${e.dbId}`)} className="ml-4 px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded font-bold text-xs transition-colors">
                          Assign →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ASSIGNED */}
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">ASSIGNED ({emergencies.filter((e: any) => e.status === 'ASSIGNED' || e.status === 'ACCEPTED').length})</h3>
                <div className="space-y-1">
                  {emergencies.filter((e: any) => e.status === 'ASSIGNED' || e.status === 'ACCEPTED').map((e: any) => (
                    <div key={e.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 px-2 rounded -mx-2 transition-colors">
                      <div className="flex items-center gap-4 w-[40%]">
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 w-16">{e.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider w-20 text-center ${getPriorityColor(e.priority)}`}>
                          {e.priority === 'CRITICAL' ? '● ' : e.priority === 'HIGH' ? '▲ ' : e.priority === 'MEDIUM' ? '♦ ' : ''}{e.priority}
                        </span>
                        <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{e.desc}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-mono justify-end flex-1">
                        <span className="text-right">{e.loc}</span>
                        <span className="w-28 text-right truncate text-slate-700 dark:text-slate-400">{e.hosp}</span>
                        <span className="w-12 text-center text-slate-700 dark:text-slate-400">{e.amb}</span>
                        <span className="w-16 text-right">{e.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* IN PROGRESS */}
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">IN PROGRESS ({emergencies.filter((e: any) => e.status === 'IN PROGRESS').length})</h3>
                <div className="space-y-1">
                  {emergencies.filter((e: any) => e.status === 'IN PROGRESS').map((e: any) => (
                    <div key={e.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 px-2 rounded -mx-2 transition-colors">
                      <div className="flex items-center gap-4 w-[40%]">
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 w-16">{e.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider w-20 text-center ${getPriorityColor(e.priority)}`}>
                          {e.priority === 'CRITICAL' ? '● ' : e.priority === 'HIGH' ? '▲ ' : ''}{e.priority}
                        </span>
                        <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{e.desc}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-mono justify-end flex-1">
                        <span className="text-right">{e.loc}</span>
                        <span className="w-28 text-right truncate text-slate-700 dark:text-slate-400">{e.hosp}</span>
                        <span className="w-12 text-center text-slate-700 dark:text-slate-400">{e.amb}</span>
                        <span className="w-16 text-right">{e.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ambulance Unit Status */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Ambulance Unit Status</h2>
            <div className="grid grid-cols-4 gap-3">
              {ambulances.map(a => {
                let cardColor = '';
                let statusColor = '';
                
                if (a.status === 'AVAILABLE') {
                  cardColor = 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/50';
                  statusColor = 'text-emerald-700 dark:text-emerald-500';
                } else if (a.status === 'BUSY') {
                  cardColor = 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/50';
                  statusColor = 'text-red-700 dark:text-red-500';
                } else {
                  cardColor = 'bg-slate-50 border-slate-200 dark:bg-slate-800/30 dark:border-slate-700/50';
                  statusColor = 'text-slate-400';
                }

                return (
                  <div key={a.id} className={`p-3 rounded-lg border ${cardColor}`}>
                    <div className="font-bold text-slate-900 dark:text-white mb-1.5">{a.id}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${statusColor}`}>{a.status}</div>
                    <div className="text-[10px] font-mono text-slate-500 mb-0.5">{a.lat}</div>
                    <div className="text-[9px] text-slate-400">{a.time}</div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
