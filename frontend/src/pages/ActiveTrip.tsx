import React from 'react';
import { Ambulance, CheckCircle2, Circle, Navigation2, Building2 } from 'lucide-react';

export default function ActiveTrip() {
  return (
    <div className="max-w-6xl mx-auto pb-12 pt-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Active Trip</h1>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Wide) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Status Header Banner */}
          <div className="bg-slate-800 dark:bg-slate-900 text-white rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center">
              <Ambulance className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wider mb-1">READY TO START</h2>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-slate-300">ER-001</span>
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Critical</span>
                <span className="bg-slate-700 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-slate-600">Not Started</span>
              </div>
            </div>
          </div>

          {/* Details Row */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Emergency ID</p>
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">ER-001</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Priority</p>
              <span className="inline-block bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">CRITICAL</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Patient</p>
              <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">P-101</p>
            </div>
            <div></div> {/* Empty for alignment */}
            
            <div className="md:col-span-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Destination</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-500" /> City Hospital
              </p>
            </div>
            <div className="md:col-span-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ambulance</p>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">A001</span>
                <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1"></span>
                  AVAILABLE
                </span>
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Location</p>
              <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">22.7196, 75.8577</p>
            </div>
          </div>

          {/* Map Area */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Simulated Route</h3>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location 1 / 4</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/20">
              <div className="relative w-full h-[400px] bg-slate-800 dark:bg-[#0f172a] rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center p-8">
                
                {/* Simulated Grid Background */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  SIMULATED MOVEMENT
                </div>
                
                {/* Route SVG */}
                <svg className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.3))' }}>
                  <polyline 
                    points="20%,80% 40%,60% 60%,70% 85%,30%" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="3" 
                    strokeDasharray="8 6" 
                    className="opacity-60"
                  />
                  {/* Waypoints */}
                  <circle cx="40%" cy="60%" r="6" fill="#475569" stroke="#1e293b" strokeWidth="2" />
                  <circle cx="60%" cy="70%" r="6" fill="#475569" stroke="#1e293b" strokeWidth="2" />
                </svg>

                {/* Start Marker */}
                <div className="absolute left-[20%] top-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="text-[10px] text-slate-400 font-mono mb-1 text-center leading-tight">22.7196<br/>75.8577</div>
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mb-1">
                    <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
                  </div>
                  <span className="text-[10px] font-bold text-white tracking-wider">START</span>
                </div>

                {/* Dest Marker */}
                <div className="absolute left-[85%] top-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="text-[10px] text-slate-400 font-mono mb-1 text-center leading-tight">22.7265<br/>75.8650</div>
                  <div className="w-3 h-3 rounded-full bg-orange-500 border-2 border-[#0f172a] shadow-lg mb-1"></div>
                  <span className="text-[10px] font-bold text-orange-500 tracking-wider">DEST</span>
                </div>

              </div>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Position</p>
              <p className="text-sm font-mono text-slate-900 dark:text-white font-medium">22.7196, 75.8577</p>
            </div>
          </div>

        </div>

        {/* Right Column (Narrow) */}
        <div className="space-y-6">
          
          {/* Trip Timeline */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6">Trip Timeline</h3>
            <div className="relative pl-6 space-y-8">
              {/* Vertical Line */}
              <div className="absolute left-2.5 top-2 bottom-4 w-px bg-slate-200 dark:bg-slate-800"></div>

              {/* Steps */}
              <div className="relative">
                <div className="absolute -left-6 top-0 bg-white dark:bg-slate-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Assignment Created</p>
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">10:40 AM</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[22px] top-1 bg-white dark:bg-slate-900">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Assignment Accepted</p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">—</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[22px] top-1 bg-white dark:bg-slate-900">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Trip Started</p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">—</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[22px] top-1 bg-white dark:bg-slate-900">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">In Progress</p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">—</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[22px] top-1 bg-white dark:bg-slate-900">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Trip Completed</p>
                  <p className="text-[11px] font-mono text-slate-300 mt-0.5">Pending</p>
                </div>
              </div>

            </div>
          </div>

          {/* Required Resources */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Required Resources</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> ICU
              </li>
              <li className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Ventilator
              </li>
              <li className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Emergency Doctor
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
