import React, { useState } from 'react';
import { Bed, Wind, Droplets, Stethoscope, Users, Edit2, Check, X, RefreshCw, Clock } from 'lucide-react';
import clsx from 'clsx';

type StatusType = 'AVAILABLE' | 'BUSY' | 'FULL';

export default function HospitalDashboard() {
  const [currentStatus, setCurrentStatus] = useState<StatusType>('AVAILABLE');
  const [selectedStatus, setSelectedStatus] = useState<StatusType>('AVAILABLE');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('2 min ago');

  // Resource overview top cards
  const overviewCards = [
    { title: 'TOTAL BEDS', value: '120', icon: Bed, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40', updated: '2 min ago' },
    { title: 'OCCUPIED BEDS', value: '94', icon: Bed, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40', updated: '2 min ago' },
    { title: 'AVAILABLE BEDS', value: '26', sub: '78% occupied', icon: Bed, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40', updated: '2 min ago', highlight: true, highlightColor: 'text-amber-500' },
    { title: 'ICU AVAILABLE', value: '8', sub: '60% occupied', icon: ActivityIcon, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40', updated: '7 min ago' },
    { title: 'VENTILATORS AVAILABLE', value: '5', icon: Wind, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40', updated: '25 min ago' },
    { title: 'OXYGEN UNITS AVAILABLE', value: '18', icon: Droplets, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40', updated: '15 min ago' },
    { title: 'DOCTORS AVAILABLE', value: '12', icon: Stethoscope, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40', updated: '40 min ago' },
    { title: 'NURSES AVAILABLE', value: '28', icon: Users, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40', updated: '5 min ago' },
  ];

  // Resource details list
  const resourceDetails = [
    {
      title: 'Bed Availability',
      icon: Bed,
      time: '2 min ago',
      total: '120',
      occupied: '94',
      available: '26',
      occupiedLabel: 'Occupied',
      percent: 78,
      percentLabel: '78% Occupied',
      availLabel: '26 Available',
      barColor: 'bg-amber-500',
    },
    {
      title: 'ICU Availability',
      icon: ActivityIcon,
      time: '7 min ago',
      total: '20',
      occupied: '12',
      available: '8',
      occupiedLabel: 'Occupied',
      percent: 60,
      percentLabel: '60% Occupied',
      availLabel: '8 Available',
      barColor: 'bg-blue-600',
    },
    {
      title: 'Ventilator Availability',
      icon: Wind,
      time: '25 min ago',
      total: '12',
      occupied: '7',
      available: '5',
      occupiedLabel: 'In Use',
      percent: 58,
      percentLabel: '58% In Use',
      availLabel: '5 Available',
      barColor: 'bg-blue-600',
    },
    {
      title: 'Oxygen Unit Availability',
      icon: Droplets,
      time: '15 min ago',
      total: '40',
      occupied: '22',
      available: '18',
      occupiedLabel: 'In Use',
      percent: 55,
      percentLabel: '55% In Use',
      availLabel: '18 Available',
      barColor: 'bg-blue-600',
    },
  ];

  // Recent resource updates table
  const recentUpdates = [
    { time: '03:10 am', resource: 'ICU Beds', previous: '8', newval: '6', user: 'Hospital Admin' },
    { time: '02:52 am', resource: 'Ventilators', previous: '6', newval: '5', user: 'Hospital Admin' },
    { time: '02:37 am', resource: 'Available Doctors', previous: '13', newval: '12', user: 'Hospital Admin' },
    { time: '02:22 am', resource: 'General Beds', previous: '28', newval: '26', user: 'Hospital Admin' },
    { time: '01:47 am', resource: 'Oxygen Units', previous: '20', newval: '18', user: 'Hospital Admin' },
  ];

  const handleOpenModal = () => {
    setSelectedStatus(currentStatus);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setCurrentStatus(selectedStatus);
    setLastUpdated('Just now');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">

      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-850 rounded-2xl p-6 shadow-xs border border-gray-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">City Care Hospital</h2>
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-gray-100 dark:bg-slate-800 text-gray-500 border border-gray-200 dark:border-slate-700">HOS-001</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Indore, Madhya Pradesh</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5" />
              Last overall update: {lastUpdated}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">EMERGENCY DEPARTMENT</span>
            <div className="flex items-center gap-3">
              <div className={clsx(
                "inline-flex items-center gap-2 px-3 py-1 rounded-full font-bold text-xs border",
                currentStatus === 'AVAILABLE' && "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40",
                currentStatus === 'BUSY' && "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40",
                currentStatus === 'FULL' && "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/40"
              )}>
                <span className={clsx(
                  "w-2 h-2 rounded-full",
                  currentStatus === 'AVAILABLE' && "bg-emerald-500",
                  currentStatus === 'BUSY' && "bg-amber-500",
                  currentStatus === 'FULL' && "bg-red-500"
                )} />
                {currentStatus === 'AVAILABLE' ? 'Available' : currentStatus === 'BUSY' ? 'Busy' : 'Full'}
              </div>

              <button 
                onClick={handleOpenModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Overview Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Resource Overview</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Current emergency resource availability at a glance.</p>
        </div>

        {/* 8 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewCards.map((card, i) => (
            <div 
              key={i} 
              className={clsx(
                "p-5 rounded-2xl border bg-white dark:bg-slate-850 shadow-xs transition-all relative flex flex-col justify-between",
                card.highlight 
                  ? "border-amber-400 dark:border-amber-500/60 ring-1 ring-amber-400/30" 
                  : "border-gray-200 dark:border-slate-800"
              )}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className={clsx("p-2 rounded-xl", card.color)}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  {card.highlight && <div className="w-2 h-2 rounded-full bg-amber-400"></div>}
                </div>
                <h4 className={clsx("text-2xl font-bold", card.highlightColor || "text-gray-900 dark:text-white")}>
                  {card.value}
                </h4>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-wider">{card.title}</p>
                {card.sub && <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>}
              </div>

              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-4 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" /> {card.updated}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Details Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Resource Details</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Detailed view with utilization and quick update controls.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {resourceDetails.map((res, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-850 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-xs space-y-4">
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500">
                    <res.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{res.title}</h4>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {res.time}
                    </p>
                  </div>
                </div>

                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors">
                  <RefreshCw className="w-3 h-3" />
                  Update
                </button>
              </div>

              {/* 3 Metric Columns */}
              <div className="grid grid-cols-3 gap-3 text-center bg-gray-50/70 dark:bg-slate-900/50 p-3 rounded-xl">
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{res.total}</p>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase">Total</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{res.occupied}</p>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase">{res.occupiedLabel}</p>
                </div>
                <div>
                  <p className={clsx("text-lg font-bold", res.title.includes('Bed') ? "text-amber-500" : "text-emerald-500")}>
                    {res.available}
                  </p>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase">Available</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-gray-500">
                  <span>{res.percentLabel}</span>
                  <span>{res.availLabel}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className={clsx("h-full rounded-full transition-all duration-500", res.barColor)} 
                    style={{ width: `${res.percent}%` }} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Availability & Capacity Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Staff Availability Card */}
        <div className="bg-white dark:bg-slate-850 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Staff Availability</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Doctors */}
            <div className="bg-gray-50/70 dark:bg-slate-900/50 p-5 rounded-2xl text-center space-y-3 flex flex-col items-center justify-between border border-gray-100 dark:border-slate-800">
              <div className="p-2.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-2xl font-bold text-gray-900 dark:text-white">12</h5>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">DOCTORS AVAILABLE</p>
                <p className="text-[10px] text-gray-400 mt-1 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> 40 min ago
                </p>
              </div>
              <button className="w-full py-1.5 px-3 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1">
                <RefreshCw className="w-3 h-3" /> Update
              </button>
            </div>

            {/* Nurses */}
            <div className="bg-gray-50/70 dark:bg-slate-900/50 p-5 rounded-2xl text-center space-y-3 flex flex-col items-center justify-between border border-gray-100 dark:border-slate-800">
              <div className="p-2.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-500">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-2xl font-bold text-gray-900 dark:text-white">28</h5>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">NURSES AVAILABLE</p>
                <p className="text-[10px] text-gray-400 mt-1 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> 5 min ago
                </p>
              </div>
              <button className="w-full py-1.5 px-3 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1">
                <RefreshCw className="w-3 h-3" /> Update
              </button>
            </div>
          </div>
        </div>

        {/* Capacity Status Card */}
        <div className="bg-white dark:bg-slate-850 rounded-2xl p-5 border border-gray-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Capacity Status</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">At-a-glance utilization overview.</p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Beds bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-700 dark:text-gray-300">Beds</span>
                <span className="text-amber-500 font-bold">78%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-amber-500" style={{ width: '78%' }} />
              </div>
            </div>

            {/* ICU bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-700 dark:text-gray-300">ICU</span>
                <span className="text-blue-600 font-bold">60%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-blue-600" style={{ width: '60%' }} />
              </div>
            </div>

            {/* Ventilators bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-700 dark:text-gray-300">Ventilators</span>
                <span className="text-blue-600 font-bold">58%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-blue-600" style={{ width: '58%' }} />
              </div>
            </div>

            {/* Oxygen bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-700 dark:text-gray-300">Oxygen</span>
                <span className="text-blue-600 font-bold">55%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-blue-600" style={{ width: '55%' }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Resource Updates Section */}
      <div className="bg-white dark:bg-slate-850 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-gray-200 dark:border-slate-800">
          <h4 className="text-base font-bold text-gray-900 dark:text-white">Recent Resource Updates</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Last 5 operational changes made to this hospital's resources.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">TIME</th>
                <th className="px-6 py-3.5">RESOURCE</th>
                <th className="px-6 py-3.5">PREVIOUS</th>
                <th className="px-6 py-3.5">NEW</th>
                <th className="px-6 py-3.5">UPDATED BY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60 text-xs">
              {recentUpdates.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5 whitespace-nowrap">
                    <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    {row.time}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {row.resource}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">
                    {row.previous}
                  </td>
                  <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">
                    {row.newval}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {row.user}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white dark:bg-[#131b2e] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-slate-700 space-y-6 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">Update Emergency Department Status</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">Select the current operational status of the emergency department.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg transition-colors ml-2"
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
                  "p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all",
                  selectedStatus === 'AVAILABLE'
                    ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 ring-1 ring-emerald-500/50"
                    : "border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">Available</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">Hospital is currently available for emergency coordination.</p>
                  </div>
                </div>
                {selectedStatus === 'AVAILABLE' && (
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 ml-2">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Option: Busy */}
              <div 
                onClick={() => setSelectedStatus('BUSY')}
                className={clsx(
                  "p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all",
                  selectedStatus === 'BUSY'
                    ? "border-amber-500 bg-amber-50/30 dark:bg-amber-950/20 ring-1 ring-amber-500/50"
                    : "border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">Busy</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">Hospital is currently operating under increased emergency load.</p>
                  </div>
                </div>
                {selectedStatus === 'BUSY' && (
                  <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 ml-2">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Option: Full */}
              <div 
                onClick={() => setSelectedStatus('FULL')}
                className={clsx(
                  "p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all",
                  selectedStatus === 'FULL'
                    ? "border-red-500 bg-red-50/30 dark:bg-red-950/20 ring-1 ring-red-500/50"
                    : "border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">Full</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">Hospital is currently at capacity for emergency coordination.</p>
                  </div>
                </div>
                {selectedStatus === 'FULL' && (
                  <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0 ml-2">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2.5 pt-1">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
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

function ActivityIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}


