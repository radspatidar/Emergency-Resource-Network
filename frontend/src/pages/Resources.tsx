import React from 'react';
import { Bed, Wind, Droplets, Stethoscope, Users, RefreshCw } from 'lucide-react';

export default function Resources() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Resource Management</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Hospital Operations &gt; Resources</p>
      </div>

      {/* Bed Availability */}
      <div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Bed Availability</h3>
        <p className="text-sm text-gray-500 mb-4">Manage general bed capacity and occupancy.</p>
        <div className="bg-white dark:bg-slate-850 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-lg"><Bed className="w-5 h-5" /></div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">General Beds</h4>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="w-3 h-3 inline-block rounded-full border-2 border-gray-300 dark:border-gray-600"></span> 1h ago
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded border border-gray-200 dark:border-slate-700 text-sm font-semibold text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors">
              <RefreshCw className="w-3 h-3" /> Update
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">120</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">94</p>
              <p className="text-xs text-gray-500">Occupied</p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">26</p>
              <p className="text-xs text-gray-500">Available</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Occupied rate</span>
              <span className="font-bold text-gray-900 dark:text-white">78%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* ICU Availability */}
      <div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white">ICU Availability</h3>
        <p className="text-sm text-gray-500 mb-4">Manage intensive care unit bed allocation.</p>
        <div className="bg-white dark:bg-slate-850 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-lg"><ActivityIcon className="w-5 h-5" /></div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">ICU Beds</h4>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="w-3 h-3 inline-block rounded-full border-2 border-gray-300 dark:border-gray-600"></span> 1h ago
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded border border-gray-200 dark:border-slate-700 text-sm font-semibold text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors">
              <RefreshCw className="w-3 h-3" /> Update
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">20</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
              <p className="text-xs text-gray-500">Occupied</p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
              <p className="text-xs text-gray-500">Available</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Occupied rate</span>
              <span className="font-bold text-gray-900 dark:text-white">60%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
              <div className="bg-brand-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Availability */}
      <div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Equipment Availability</h3>
        <p className="text-sm text-gray-500 mb-4">Manage ventilators and oxygen unit allocation.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ventilators */}
          <div className="bg-white dark:bg-slate-850 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-lg"><Wind className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Ventilators</h4>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="w-3 h-3 inline-block rounded-full border-2 border-gray-300 dark:border-gray-600"></span> 1h ago
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded border border-gray-200 dark:border-slate-700 text-sm font-semibold text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors">
                <RefreshCw className="w-3 h-3" /> Update
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-8">
              <div className="bg-gray-50 dark:bg-slate-900/50 py-3 rounded-xl text-center">
                <p className="text-xl font-bold text-gray-900 dark:text-white">12</p>
                <p className="text-[10px] text-gray-500">Total</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 py-3 rounded-xl text-center">
                <p className="text-xl font-bold text-gray-900 dark:text-white">7</p>
                <p className="text-[10px] text-gray-500">In Use</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 py-3 rounded-xl text-center">
                <p className="text-xl font-bold text-gray-900 dark:text-white">5</p>
                <p className="text-[10px] text-gray-500">Available</p>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">In Use rate</span>
                <span className="font-bold text-gray-900 dark:text-white">58%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-brand-500 h-2 rounded-full" style={{ width: '58%' }}></div>
              </div>
            </div>
          </div>

          {/* Oxygen Units */}
          <div className="bg-white dark:bg-slate-850 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-lg"><Droplets className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Oxygen Units</h4>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="w-3 h-3 inline-block rounded-full border-2 border-gray-300 dark:border-gray-600"></span> 1h ago
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded border border-gray-200 dark:border-slate-700 text-sm font-semibold text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors">
                <RefreshCw className="w-3 h-3" /> Update
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-8">
              <div className="bg-gray-50 dark:bg-slate-900/50 py-3 rounded-xl text-center">
                <p className="text-xl font-bold text-gray-900 dark:text-white">40</p>
                <p className="text-[10px] text-gray-500">Total</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 py-3 rounded-xl text-center">
                <p className="text-xl font-bold text-gray-900 dark:text-white">22</p>
                <p className="text-[10px] text-gray-500">In Use</p>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 py-3 rounded-xl text-center">
                <p className="text-xl font-bold text-gray-900 dark:text-white">18</p>
                <p className="text-[10px] text-gray-500">Available</p>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">In Use rate</span>
                <span className="font-bold text-gray-900 dark:text-white">55%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-brand-500 h-2 rounded-full" style={{ width: '55%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Availability */}
      <div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Staff Availability</h3>
        <p className="text-sm text-gray-500 mb-4">Manage available medical staff counts.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-850 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-lg"><Stethoscope className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Doctors</h4>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="w-3 h-3 inline-block rounded-full border-2 border-gray-300 dark:border-gray-600"></span> 2h ago
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded border border-gray-200 dark:border-slate-700 text-sm font-semibold text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors">
                <RefreshCw className="w-3 h-3" /> Update
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
              <p className="text-xs text-gray-500 mt-1">Doctors Available</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-850 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-lg"><Users className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Nurses</h4>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="w-3 h-3 inline-block rounded-full border-2 border-gray-300 dark:border-gray-600"></span> 1h ago
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded border border-gray-200 dark:border-slate-700 text-sm font-semibold text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors">
                <RefreshCw className="w-3 h-3" /> Update
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">28</p>
              <p className="text-xs text-gray-500 mt-1">Nurses Available</p>
            </div>
          </div>
        </div>
      </div>
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
