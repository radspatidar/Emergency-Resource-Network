import React, { useState } from 'react';
import { Check, Edit3, Clock, X, AlertCircle, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

type StatusType = 'AVAILABLE' | 'BUSY' | 'FULL';

export default function EmergencyStatus() {
  const [currentStatus, setCurrentStatus] = useState<StatusType>('AVAILABLE');
  const [selectedStatus, setSelectedStatus] = useState<StatusType>('AVAILABLE');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('8 minutes ago');

  const handleOpenModal = () => {
    setSelectedStatus(currentStatus);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setCurrentStatus(selectedStatus);
    setLastUpdated('Just now');
    setIsModalOpen(false);
  };

  const getStatusBg = (status: StatusType) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40';
      case 'BUSY':
        return 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40';
      case 'FULL':
        return 'bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-800/40';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Title & Breadcrumb */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Emergency Department</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Hospital Operations &gt; <span className="text-gray-700 dark:text-gray-300 font-medium">Emergency Status</span>
        </p>
      </div>

      {/* Hospital Details Card */}
      <div className="bg-white dark:bg-slate-850 rounded-xl p-5 border border-gray-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">City Care Hospital</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">HOS-001 • Indore, Madhya Pradesh</p>
      </div>

      {/* Main Status Display Card */}
      <div className={clsx("rounded-2xl p-10 border text-center transition-all duration-300 shadow-sm flex flex-col items-center justify-center space-y-4", getStatusBg(currentStatus))}>
        {/* Status Icon */}
        {currentStatus === 'AVAILABLE' && (
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-8 ring-emerald-500/10">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
        )}
        {currentStatus === 'BUSY' && (
          <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 ring-8 ring-amber-500/10">
            <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
          </div>
        )}
        {currentStatus === 'FULL' && (
          <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/20 ring-8 ring-red-500/10">
            <AlertCircle className="w-8 h-8 stroke-[2.5]" />
          </div>
        )}

        {/* Status Badge */}
        <div className={clsx(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
          currentStatus === 'AVAILABLE' && "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400",
          currentStatus === 'BUSY' && "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400",
          currentStatus === 'FULL' && "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400"
        )}>
          <span className={clsx(
            "w-2 h-2 rounded-full",
            currentStatus === 'AVAILABLE' && "bg-emerald-500",
            currentStatus === 'BUSY' && "bg-amber-500",
            currentStatus === 'FULL' && "bg-red-500"
          )} />
          {currentStatus === 'AVAILABLE' ? 'Available' : currentStatus === 'BUSY' ? 'Busy' : 'Full'}
        </div>

        {/* Title & Description */}
        <div className="max-w-md space-y-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Emergency Department</h2>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {currentStatus === 'AVAILABLE' && 'Hospital is currently accepting emergency cases.'}
            {currentStatus === 'BUSY' && 'Hospital is operating under increased emergency load.'}
            {currentStatus === 'FULL' && 'Hospital is currently at maximum capacity for emergency cases.'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This hospital will be matched for emergency resource coordination requests.
          </p>
        </div>

        {/* Time footer */}
        <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5 pt-2">
          <Clock className="w-3.5 h-3.5" />
          Status last updated {lastUpdated}
        </p>
      </div>

      {/* Change Emergency Status Container */}
      <div className="bg-white dark:bg-slate-850 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Change Emergency Status</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Update the hospital's current operational emergency status.</p>
          </div>
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Update Status
          </button>
        </div>

        {/* 3 Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Available Card */}
          <div className={clsx(
            "p-5 rounded-xl border flex flex-col items-center justify-center text-center space-y-1 transition-all",
            currentStatus === 'AVAILABLE' 
              ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700/50 shadow-sm ring-1 ring-emerald-500/20" 
              : "bg-gray-50/50 dark:bg-slate-900/30 border-gray-200 dark:border-slate-800"
          )}>
            <div className="w-3 h-3 rounded-full bg-emerald-500 mb-1" />
            <span className="text-xs font-bold tracking-wider text-gray-800 dark:text-gray-200 uppercase">AVAILABLE</span>
            {currentStatus === 'AVAILABLE' && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Current</span>
            )}
          </div>

          {/* Busy Card */}
          <div className={clsx(
            "p-5 rounded-xl border flex flex-col items-center justify-center text-center space-y-1 transition-all",
            currentStatus === 'BUSY' 
              ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/50 shadow-sm ring-1 ring-amber-500/20" 
              : "bg-gray-50/50 dark:bg-slate-900/30 border-gray-200 dark:border-slate-800"
          )}>
            <div className="w-3 h-3 rounded-full bg-amber-500 mb-1" />
            <span className="text-xs font-bold tracking-wider text-gray-800 dark:text-gray-200 uppercase">BUSY</span>
            {currentStatus === 'BUSY' && (
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Current</span>
            )}
          </div>

          {/* Full Card */}
          <div className={clsx(
            "p-5 rounded-xl border flex flex-col items-center justify-center text-center space-y-1 transition-all",
            currentStatus === 'FULL' 
              ? "bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-700/50 shadow-sm ring-1 ring-red-500/20" 
              : "bg-gray-50/50 dark:bg-slate-900/30 border-gray-200 dark:border-slate-800"
          )}>
            <div className="w-3 h-3 rounded-full bg-red-500 mb-1" />
            <span className="text-xs font-bold tracking-wider text-gray-800 dark:text-gray-200 uppercase">FULL</span>
            {currentStatus === 'FULL' && (
              <span className="text-[11px] text-red-600 dark:text-red-400 font-medium">Current</span>
            )}
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white dark:bg-[#131b2e] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-slate-700 space-y-6 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Update Emergency Department Status</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Select the current operational status of the emergency department.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Radio Options */}
            <div className="space-y-3">
              {/* Option: Available */}
              <div 
                onClick={() => setSelectedStatus('AVAILABLE')}
                className={clsx(
                  "p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all",
                  selectedStatus === 'AVAILABLE'
                    ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 ring-1 ring-emerald-500/50"
                    : "border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Available</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Hospital is currently available for emergency coordination.</p>
                  </div>
                </div>
                {selectedStatus === 'AVAILABLE' && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Option: Busy */}
              <div 
                onClick={() => setSelectedStatus('BUSY')}
                className={clsx(
                  "p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all",
                  selectedStatus === 'BUSY'
                    ? "border-amber-500 bg-amber-50/30 dark:bg-amber-950/20 ring-1 ring-amber-500/50"
                    : "border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Busy</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Hospital is currently operating under increased emergency load.</p>
                  </div>
                </div>
                {selectedStatus === 'BUSY' && (
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Option: Full */}
              <div 
                onClick={() => setSelectedStatus('FULL')}
                className={clsx(
                  "p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all",
                  selectedStatus === 'FULL'
                    ? "border-red-500 bg-red-50/30 dark:bg-red-950/20 ring-1 ring-red-500/50"
                    : "border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Full</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Hospital is currently at capacity for emergency coordination.</p>
                  </div>
                </div>
                {selectedStatus === 'FULL' && (
                  <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

