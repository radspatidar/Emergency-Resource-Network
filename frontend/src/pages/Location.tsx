import React from 'react';
import { Navigation2, MapPin, RefreshCw } from 'lucide-react';

export default function Location() {
  return (
    <div className="max-w-6xl mx-auto pb-12 pt-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Location</h1>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Simulated Location</h2>
        <p className="text-sm font-medium text-orange-600 dark:text-orange-500 mt-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
          This is a simulated location system. Not real GPS tracking.
        </p>
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
                <p className="text-3xl font-mono font-bold text-slate-900 dark:text-white leading-none">22.7196</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Longitude</p>
                <p className="text-3xl font-mono font-bold text-slate-900 dark:text-white leading-none">75.8577</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Last Updated</p>
                <p className="text-sm font-mono text-slate-600 dark:text-slate-400 font-medium">03:52:28 pm</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Waypoint</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Start Point</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Progress</p>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-2 mb-2">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <p className="text-xs text-slate-500 font-medium">Stop 1 of 4</p>
              </div>
            </div>

            <button disabled className="mt-8 w-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed transition-colors">
              <RefreshCw className="w-4 h-4" />
              Start trip to update location
            </button>
          </div>
        </div>

        {/* Right Col */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Route Visualization</h3>
            
            <div className="relative w-full h-[400px] bg-slate-800 dark:bg-[#0f172a] rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center p-8 mb-6">
              {/* Simulated Grid Background */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              
              {/* Badge */}
              <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider flex items-center gap-1.5 z-10">
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

            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Simulated Waypoints</h3>
            
            <div className="space-y-3">
              {/* Waypoint 1 */}
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">1</span>
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">22.7196, 75.8577</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Start Point</span>
                  <span className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded">START</span>
                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">CURRENT</span>
                </div>
              </div>

              {/* Waypoint 2 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-3 flex items-center justify-between opacity-70">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-xs font-bold">2</span>
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">22.7205, 75.8590</span>
                </div>
                <span className="text-xs font-medium text-slate-400">En Route</span>
              </div>

              {/* Waypoint 3 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-3 flex items-center justify-between opacity-70">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-xs font-bold">3</span>
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">22.7230, 75.8615</span>
                </div>
                <span className="text-xs font-medium text-slate-400">En Route</span>
              </div>

              {/* Waypoint 4 */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-3 flex items-center justify-between opacity-70">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-xs font-bold">4</span>
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">22.7265, 75.8650</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-medium text-slate-400">Near Destination</span>
                  <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-500 text-[10px] font-bold px-2 py-0.5 rounded">DEST</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
