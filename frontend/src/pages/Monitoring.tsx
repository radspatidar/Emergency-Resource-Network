import React from 'react';
import { MapPin } from 'lucide-react';

const hospitals = [
  { name: 'City Care Hospital', icu: 8, beds: 26, vents: 5, dr: 12, status: 'AVAILABLE', time: '2 min ago' },
  { name: 'Metro General Hospital', icu: 4, beds: 18, vents: 3, dr: 8, status: 'AVAILABLE', time: '5 min ago' },
  { name: 'Apollo Emergency Center', icu: 2, beds: 9, vents: 1, dr: 5, status: 'BUSY', time: '1 min ago' },
  { name: 'Central Hospital', icu: 6, beds: 32, vents: 0, dr: 9, status: 'AVAILABLE', time: '3 min ago' },
  { name: 'Cityline Medical', icu: 3, beds: 14, vents: 2, dr: 6, status: 'AVAILABLE', time: '7 min ago' },
  { name: 'Sunrise Health Institute', icu: 0, beds: 0, vents: 0, dr: 4, status: 'FULL', time: '4 min ago' },
];

const ambulances = [
  { id: 'A-001', status: 'AVAILABLE', lat: '22.720, 75.858', time: '30 sec ago' },
  { id: 'A-002', status: 'BUSY', lat: '22.725, 75.881', time: '1 min ago' },
  { id: 'A-003', status: 'BUSY', lat: '22.709, 75.876', time: '45 sec ago' },
  { id: 'A-004', status: 'AVAILABLE', lat: '22.731, 75.844', time: '20 sec ago' },
  { id: 'A-005', status: 'AVAILABLE', lat: '22.718, 75.892', time: '1 min ago' },
  { id: 'A-006', status: 'AVAILABLE', lat: '22.740, 75.876', time: '2 min ago' },
  { id: 'A-007', status: 'BUSY', lat: '22.703, 75.850', time: '30 sec ago' },
  { id: 'A-008', status: 'AVAILABLE', lat: '22.723, 75.863', time: '40 sec ago' },
  { id: 'A-009', status: 'AVAILABLE', lat: '22.747, 75.860', time: '15 sec ago' },
  { id: 'A-010', status: 'OFFLINE', lat: '22.735, 75.881', time: '15 min ago' },
  { id: 'A-011', status: 'BUSY', lat: '22.714, 75.873', time: '1 min ago' },
  { id: 'A-012', status: 'AVAILABLE', lat: '22.729, 75.848', time: '25 sec ago' },
];

export default function Monitoring() {
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
                <div className="text-xl font-bold text-slate-900 dark:text-white">6</div>
              </div>
              <div className="p-3 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">AVAILABLE</div>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-500">4</div>
              </div>
              <div className="p-3 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">BUSY</div>
                <div className="text-xl font-bold text-orange-500">1</div>
              </div>
              <div className="p-3 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">FULL</div>
                <div className="text-xl font-bold text-red-500">1</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-800 border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10">
              <div className="p-2 text-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
                <span className="text-blue-600 dark:text-blue-400 text-sm">23</span> ICU AVAIL
              </div>
              <div className="p-2 text-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
                <span className="text-blue-600 dark:text-blue-400 text-sm">99</span> BEDS AVAIL
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
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-500 mb-1">7</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AVAILABLE</div>
              </div>
              <div className="p-3 text-center">
                <div className="text-xl font-bold text-orange-500 mb-1">4</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">BUSY</div>
              </div>
              <div className="p-3 text-center">
                <div className="text-xl font-bold text-slate-900 dark:text-white mb-1">11</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">TOTAL ACTIVE</div>
              </div>
            </div>

            <div className="p-4 bg-slate-900 relative h-[250px] m-4 rounded-xl border border-slate-800 overflow-hidden group">
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2 py-1 bg-slate-800/80 rounded backdrop-blur text-[10px] font-bold text-slate-300 uppercase tracking-wider border border-slate-700/50">
                <MapPin className="w-3 h-3 text-blue-400" /> SIMULATED LOCATIONS — NOT REAL GPS
              </div>
              <div className="absolute top-3 right-3 z-10 text-[9px] text-slate-500 uppercase font-bold">
                Indore region · 11 units
              </div>
              
              {/* Map background simulation */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' }}></div>
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

              {/* Dots */}
              <div className="absolute top-[30%] left-[40%] w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              <div className="absolute top-[50%] left-[20%] w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              <div className="absolute top-[70%] left-[60%] w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              <div className="absolute top-[20%] left-[70%] w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              <div className="absolute top-[80%] left-[30%] w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              <div className="absolute top-[45%] left-[80%] w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              <div className="absolute top-[60%] left-[85%] w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              
              <div className="absolute top-[40%] left-[55%] w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
              <div className="absolute top-[25%] left-[35%] w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
              <div className="absolute top-[65%] left-[45%] w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
              <div className="absolute top-[75%] left-[25%] w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>

              <div className="absolute bottom-3 left-3 z-10 flex gap-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Available (7)</span>
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Busy (4)</span>
              </div>
              <div className="absolute bottom-3 right-3 z-10 text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Hover for ID
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
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">PENDING (3)</h3>
                <div className="space-y-1">
                  {[
                    { id: 'ER-1025', priority: 'CRITICAL', desc: 'Road Accident', loc: 'Indore', time: '10:42 AM' },
                    { id: 'ER-1021', priority: 'CRITICAL', desc: 'Stroke', loc: 'Jabalpur', time: '10:05 AM' },
                    { id: 'ER-1018', priority: 'HIGH', desc: 'Burns', loc: 'Bhopal', time: '09:44 AM' }
                  ].map(e => (
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
                        <button className="ml-4 px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded font-bold text-xs transition-colors">
                          Assign →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ASSIGNED */}
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">ASSIGNED (2)</h3>
                <div className="space-y-1">
                  {[
                    { id: 'ER-1023', priority: 'HIGH', desc: 'Respiratory Emergency', loc: 'Indore', hosp: 'Metro General', amb: 'A-007', time: '10:35 AM' },
                    { id: 'ER-1020', priority: 'MEDIUM', desc: 'Cardiac Emergency', loc: 'Gwalior', hosp: 'Cityline Medical', amb: 'A-011', time: '10:01 AM' }
                  ].map(e => (
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
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">IN PROGRESS (2)</h3>
                <div className="space-y-1">
                  {[
                    { id: 'ER-1024', priority: 'HIGH', desc: 'Cardiac Emergency', loc: 'Bhopal', hosp: 'City Care', amb: 'A-003', time: '10:47 AM' },
                    { id: 'ER-1022', priority: 'CRITICAL', desc: 'Trauma', loc: 'Ujjain', hosp: 'Apollo Emergency', amb: 'A-002', time: '10:45 AM' }
                  ].map(e => (
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
