import React, { useState } from 'react';
import { Ambulance, AlertTriangle, Activity, MapPin, Building2, User, ChevronRight } from 'lucide-react';

export default function OperatorDashboard() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="max-w-6xl mx-auto pb-12 pt-2">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase flex items-center gap-2">
            AMBULANCE A001 
            <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 tracking-wider">
              <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1"></span>
              AVAILABLE
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Emergency Resource Coordination — Operator View</p>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
          <ClockIcon className="w-3.5 h-3.5" />
          Last Updated: 03:38:42 pm
        </div>
      </div>

      {/* Top 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <Ambulance className="w-5 h-5 text-slate-400 mb-3" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ambulance Status</p>
            <span className="inline-flex items-center text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold mb-1 border border-emerald-200 dark:border-emerald-800">
              <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1"></span>
              AVAILABLE
            </span>
            <p className="text-xs text-slate-500 font-medium">Unit A001</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-blue-200 dark:border-blue-800/50 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
          <AlertTriangle className="w-5 h-5 text-slate-400 mb-3 ml-2" />
          <div className="ml-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Assignment</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white font-mono leading-none mb-1">ER-001</p>
            <p className="text-xs text-slate-500 font-medium">Active emergency</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <Activity className="w-5 h-5 text-slate-400 mb-3" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Emergency Priority</p>
            <span className="inline-block text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-bold tracking-wider mb-1">
              CRITICAL
            </span>
            <p className="text-xs text-slate-500 font-medium">Medical Emergency</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <Ambulance className="w-5 h-5 text-slate-400 mb-3" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Trip Status</p>
            <span className="inline-block text-[10px] bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold mb-1 border border-slate-200 dark:border-slate-700">
              NOT STARTED
            </span>
            <p className="text-xs text-slate-500 font-medium">Awaiting start</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between md:hidden">
          <MapPin className="w-5 h-5 text-slate-400 mb-3" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Location</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white font-mono mb-1">22.7196, 75.8577</p>
            <p className="text-xs text-orange-500 font-medium uppercase">SIMULATED</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="bg-red-50/50 dark:bg-red-900/10 p-5 border-b border-red-100 dark:border-red-900/20 flex justify-between items-center relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-red-500 rounded-r-md"></div>
              <div className="ml-3">
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Active Emergency</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">ER-001</p>
              </div>
              <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded tracking-wider">
                CRITICAL
              </span>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Patient ID</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">P-101</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Emergency Type</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Medical Emergency</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Destination</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-500" />
                    City Hospital
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Assignment Status</p>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    ASSIGNED
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Required Resources</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-white border border-blue-200 dark:bg-slate-800 dark:border-slate-700 dark:text-blue-400 rounded-full shadow-sm">ICU</span>
                  <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-white border border-blue-200 dark:bg-slate-800 dark:border-slate-700 dark:text-blue-400 rounded-full shadow-sm">Ventilator</span>
                  <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-white border border-blue-200 dark:bg-slate-800 dark:border-slate-700 dark:text-blue-400 rounded-full shadow-sm">Emergency Doctor</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowModal(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors"
                >
                  Accept Assignment
                </button>
                <button className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors">
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hidden md:block">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Current Location</h3>
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">SIMULATED</span>
            </div>
            
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Coordinates</p>
            <p className="text-sm font-mono text-slate-700 dark:text-slate-300 font-bold mb-4">22.7196, 75.8577</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Latitude</p>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-400">22.7196</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Longitude</p>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-400">75.8577</p>
              </div>
            </div>
            
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Last Updated</p>
              <p className="text-xs font-mono text-slate-500">03:38:42 pm</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Emergency Details</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Update Location</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Trip History</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accept Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50">
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Accept Emergency Assignment?</h2>
              <p className="text-sm text-slate-500 mb-6">Please confirm that you accept this emergency assignment.</p>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 grid grid-cols-2 gap-y-4 gap-x-4 mb-6 border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Emergency</p>
                  <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">ER-001</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Priority</p>
                  <span className="inline-block text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-bold tracking-wider">CRITICAL</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Destination</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">City Hospital</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ambulance</p>
                  <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">A001</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Patient</p>
                  <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">P-101</p>
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
                  onClick={() => {
                    setShowModal(false);
                    // Add routing logic or whatever
                  }}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition-colors"
                >
                  Accept Assignment
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
