import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

import { createEmergency } from '../api/client';

export default function CreateEmergency() {
  const navigate = useNavigate();

  const [patientId, setPatientId] = useState('');
  const [emergencyType, setEmergencyType] = useState('');
  const [location, setLocation] = useState('');
  const [treatment, setTreatment] = useState('');
  const [priority, setPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('CRITICAL');
  
  const [reqIcu, setReqIcu] = useState(false);
  const [reqVent, setReqVent] = useState(false);
  const [reqDoctor, setReqDoctor] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const resources = [];
      if (reqIcu) resources.push('ICU');
      if (reqVent) resources.push('Ventilator');
      if (reqDoctor) resources.push('Emergency Doctor');
      
      await createEmergency({
        patientId,
        emergencyType,
        location,
        priority,
        requiredResources: resources,
        notes: treatment
      });
      navigate('/emergency-requests');
    } catch (err) {
      console.error(err);
      alert('Failed to create emergency request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResourcesText = () => {
    const list = [];
    if (reqIcu) list.push('ICU Bed');
    if (reqVent) list.push('Ventilator');
    if (reqDoctor) list.push('Emergency Doctor');
    return list.length > 0 ? list.join(', ') : 'None selected';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/emergency-requests')}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Emergency Request</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Register a new emergency and assign resources.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Form Column (2/3 width) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">

          {/* Step 1: Emergency Information */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</span>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Emergency Information</h3>
            </div>

            {/* Patient ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Patient ID <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={patientId}
                onChange={e => setPatientId(e.target.value)}
                placeholder="e.g. P-501"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Emergency Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Emergency Type <span className="text-red-500">*</span></label>
              <select
                required
                value={emergencyType}
                onChange={e => setEmergencyType(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">Select emergency type...</option>
                <option value="Road Accident">Road Accident</option>
                <option value="Cardiac Emergency">Cardiac Emergency</option>
                <option value="Trauma">Trauma</option>
                <option value="Stroke">Stroke</option>
                <option value="Respiratory Emergency">Respiratory Emergency</option>
                <option value="Burns">Burns</option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Location <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Indore, Madhya Pradesh"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Step 2: Clinical Requirement */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">2</span>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Clinical Requirement</h3>
            </div>

            {/* Required Treatment */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Required Treatment <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={treatment}
                onChange={e => setTreatment(e.target.value)}
                placeholder="e.g. Emergency Trauma Care"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Priority Select Buttons */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Priority <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPriority('CRITICAL')}
                  className={clsx(
                    "py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all",
                    priority === 'CRITICAL'
                      ? "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 ring-1 ring-red-500/50"
                      : "border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50"
                  )}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  CRITICAL
                </button>

                <button
                  type="button"
                  onClick={() => setPriority('HIGH')}
                  className={clsx(
                    "py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all",
                    priority === 'HIGH'
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/50"
                      : "border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50"
                  )}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  HIGH
                </button>

                <button
                  type="button"
                  onClick={() => setPriority('MEDIUM')}
                  className={clsx(
                    "py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all",
                    priority === 'MEDIUM'
                      ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 ring-1 ring-yellow-500/50"
                      : "border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50"
                  )}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  MEDIUM
                </button>
              </div>
            </div>
          </div>

          {/* Step 3: Required Resources */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">3</span>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Required Resources</h3>
            </div>

            <div className="space-y-3">
              {/* ICU Bed Checkbox */}
              <label className={clsx(
                "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all",
                reqIcu ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/20" : "border-gray-200 dark:border-slate-800"
              )}>
                <input
                  type="checkbox"
                  checked={reqIcu}
                  onChange={e => setReqIcu(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  🛏️ ICU Bed
                </span>
              </label>

              {/* Ventilator Checkbox */}
              <label className={clsx(
                "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all",
                reqVent ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/20" : "border-gray-200 dark:border-slate-800"
              )}>
                <input
                  type="checkbox"
                  checked={reqVent}
                  onChange={e => setReqVent(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  🫁 Ventilator
                </span>
              </label>

              {/* Emergency Doctor Checkbox */}
              <label className={clsx(
                "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all",
                reqDoctor ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/20" : "border-gray-200 dark:border-slate-800"
              )}>
                <input
                  type="checkbox"
                  checked={reqDoctor}
                  onChange={e => setReqDoctor(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  👨‍⚕️ Emergency Doctor
                </span>
              </label>
            </div>
          </div>
        </form>

        {/* Right Summary Column (1/3 width) */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-850 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Request Summary</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Live preview</p>
            </div>

            <div className="space-y-3 pt-2 text-xs border-t border-gray-100 dark:border-slate-800">
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/60">
                <span className="text-gray-500">Request ID</span>
                <span className="font-bold text-gray-900 dark:text-white">ER-1026</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/60">
                <span className="text-gray-500">Patient ID</span>
                <span className="font-bold text-gray-900 dark:text-white">{patientId || '—'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/60">
                <span className="text-gray-500">Type</span>
                <span className="font-bold text-gray-900 dark:text-white">{emergencyType || '—'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/60">
                <span className="text-gray-500">Location</span>
                <span className="font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{location || '—'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/60">
                <span className="text-gray-500">Priority</span>
                <span className={clsx(
                  "font-bold uppercase px-2 py-0.5 rounded text-[10px]",
                  priority === 'CRITICAL' && "bg-red-100 text-red-600",
                  priority === 'HIGH' && "bg-amber-100 text-amber-600",
                  priority === 'MEDIUM' && "bg-yellow-100 text-yellow-600"
                )}>{priority}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/60">
                <span className="text-gray-500">Resources</span>
                <span className="font-medium text-gray-700 dark:text-gray-300 text-right truncate max-w-[160px]">{getResourcesText()}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500">Status</span>
                <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400">PENDING</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-xl shadow-md transition-colors disabled:opacity-70 flex justify-center items-center"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Create Emergency Request'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/emergency-requests')}
              className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 text-sm font-semibold rounded-xl transition-colors text-center"
            >
              Cancel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
