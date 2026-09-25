import React, { useState } from 'react';
import { User, Building2, MapPin, Ambulance } from 'lucide-react';

export default function AssignedEmergency() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="max-w-4xl mx-auto pb-12 pt-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Assigned Emergency</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-red-100 dark:border-red-900/30 shadow-sm flex justify-between items-center mb-6 relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-red-500 rounded-r-md"></div>
        <div className="ml-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Emergency ID</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono leading-none">ER-001</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded tracking-wider uppercase">Critical</span>
          <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 text-[10px] font-bold px-3 py-1 rounded border border-blue-200 dark:border-blue-800 tracking-wider uppercase">Assigned</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Emergency Overview */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Emergency Overview</h3>
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Emergency Type</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Medical Emergency</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Priority</p>
              <span className="inline-block text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-bold tracking-wider uppercase">CRITICAL</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</p>
              <span className="inline-block text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full font-bold tracking-wider uppercase">ASSIGNED</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Trip Status</p>
              <span className="inline-block text-[10px] bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full font-bold tracking-wider uppercase">NOT STARTED</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Created At</p>
              <p className="text-xs font-mono text-slate-600 dark:text-slate-400 font-medium">10:40 AM</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assigned At</p>
              <p className="text-xs font-mono text-slate-600 dark:text-slate-400 font-medium">10:42 AM</p>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Patient Information</h3>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl flex items-center gap-4 mb-4 border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient ID</p>
                <p className="text-lg font-mono font-bold text-slate-900 dark:text-white leading-tight">P-101</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50/80 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 p-3 rounded-lg text-xs font-medium text-yellow-800 dark:text-yellow-500 leading-relaxed">
            Patient details are managed by the emergency dispatch system. Contact dispatch for additional information.
          </div>
        </div>

        {/* Destination Hospital */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Destination Hospital</h3>
          <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl flex items-center gap-4 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-base">City Hospital</p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase">Primary Destination</p>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Ambulance Location</p>
            <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">22.7196, 75.8577</p>
          </div>
        </div>

        {/* Required Resources */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Required Resources</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400 rounded flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-blue-500"></span> ICU
            </span>
            <span className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400 rounded flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-blue-500"></span> Ventilator
            </span>
            <span className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400 rounded flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-blue-500"></span> Emergency Doctor
            </span>
          </div>

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Ambulance Assignment</p>
          <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg flex items-center justify-between border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Ambulance className="w-4 h-4 text-slate-500" />
              <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">A001</span>
            </div>
            <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1"></span>
              AVAILABLE
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Operator Action Required</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Review emergency details and accept the assignment to proceed.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
        >
          Accept Assignment
        </button>
      </div>

      {/* Accept Assignment Modal */}
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
                  onClick={() => setShowModal(false)}
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
