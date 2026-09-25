import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, PhoneCall, Clock, CheckCircle, Activity, MapPin } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { createEmergency, getEmergency } from '../api/client';
import clsx from 'clsx';

function PublicTracker({ emergencyId, onNew }: { emergencyId: string, onNew: () => void }) {
  const { data: emergency } = useQuery({
    queryKey: ['emergency', emergencyId],
    queryFn: () => getEmergency(emergencyId),
    refetchInterval: 2000,
  });

  if (!emergency) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center flex items-center justify-center min-h-[300px]">
        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Fetching live status...</p>
      </div>
    );
  }

  const s = emergency.status.toUpperCase();
  const stepMap: Record<string, number> = {
    'PENDING': 1,
    'ACKNOWLEDGED': 2,
    'ASSIGNED': 3,
    'ACCEPTED': 4,
    'IN PROGRESS': 5,
    'COMPLETED': 6
  };
  const currentStep = stepMap[s] || 1;

  const steps = [
    { num: 1, label: 'Request Received' },
    { num: 2, label: 'Coordinator Acknowledged' },
    { num: 3, label: 'Ambulance Assigned' },
    { num: 4, label: 'Ambulance Accepted' },
    { num: 5, label: 'Response In Progress' },
    { num: 6, label: 'Emergency Completed' },
  ];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-900">{emergency.requestCode}</h3>
        <span className={clsx(
          "px-3 py-1 text-xs font-bold rounded-full border uppercase",
          s === 'COMPLETED' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
          "bg-blue-50 text-blue-600 border-blue-200"
        )}>
          {s}
        </span>
      </div>

      <div className="space-y-4 mb-8">
        {steps.map(step => {
          const isCompleted = currentStep >= step.num;
          const isActive = currentStep === step.num && currentStep < 6;
          
          return (
            <div key={step.num} className="flex items-center gap-4">
              <div className={clsx(
                "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                isCompleted ? "bg-green-500 text-white" : 
                isActive ? "bg-blue-100 text-blue-600 border-2 border-blue-500" : 
                "bg-slate-200 text-slate-400"
              )}>
                {isCompleted ? <CheckCircle className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
              </div>
              <span className={clsx(
                "text-sm font-semibold transition-colors",
                isCompleted ? "text-slate-900" :
                isActive ? "text-blue-600" : "text-slate-400"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {currentStep >= 3 && emergency.trip?.ambulance && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assignment Details</h4>
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-semibold text-slate-900">Ambulance: {emergency.trip.ambulance.vehicleNo}</span>
          </div>
          {emergency.hospitalId && (
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-slate-900">Destination: ID {emergency.hospitalId}</span>
            </div>
          )}
        </div>
      )}

      {emergency.trip && emergency.trip.status === 'In Progress' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-6 flex flex-col">
          <div className="p-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-500" /> Live GPS Tracking
            </h3>
            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Live
            </span>
          </div>
          <div className="p-3 bg-slate-100">
            <div className="relative w-full h-[250px] bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center p-4">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              <div className="absolute right-[20%] top-[20%] flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mb-1 border border-blue-500/50">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-[9px] font-bold text-white tracking-wider bg-black/50 px-1.5 py-0.5 rounded">HOSPITAL</span>
              </div>
              <div 
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 transition-all duration-[2000ms] ease-linear"
                style={{ 
                  left: `${((emergency.trip.currentLng % 0.05) / 0.05) * 80 + 10}%`, 
                  top: `${((emergency.trip.currentLat % 0.05) / 0.05) * 80 + 10}%` 
                }}
              >
                <div className="text-[9px] text-emerald-400 font-mono mb-1 text-center leading-tight bg-black/60 px-1.5 py-0.5 rounded">
                  {emergency.trip.currentLat?.toFixed(4) || '22.7196'}, {emergency.trip.currentLng?.toFixed(4) || '75.8577'}
                </div>
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mb-1 border-2 border-white shadow-[0_0_10px_rgba(16,185,129,0.5)] z-10">
                  <Activity className="w-3 h-3 text-white" />
                </div>
                <span className="text-[9px] font-bold text-white tracking-wider bg-black/50 px-1.5 py-0.5 rounded mt-0.5">AMBULANCE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === 6 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 text-center">
          <p className="text-sm font-semibold text-emerald-700">Thank you for reporting the emergency.</p>
        </div>
      )}

      <button onClick={onNew} className="w-full px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-all shadow-sm">
        Submit Another Request
      </button>
    </div>
  );
}

export default function LandingPage() {
  const [form, setForm] = useState({
    patientId: 'PUBLIC-' + Math.floor(Math.random() * 10000),
    emergencyType: 'Medical Emergency',
    location: '',
    priority: 'High',
    requiredResources: [] as string[],
    notes: '',
  });

  const [createdEmergency, setCreatedEmergency] = useState<any>(null);

  const requestMutation = useMutation({
    mutationFn: (data: any) => createEmergency(data),
    onSuccess: (data) => {
      setCreatedEmergency(data);
      setForm({ ...form, location: '', notes: '' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.location) return;
    requestMutation.mutate({
      ...form,
      createdBy: 'Public User',
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white relative overflow-hidden">
      
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-md shadow-brand-500/20">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-wide">HealthResQ</span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 active:bg-brand-700 rounded-full shadow-md shadow-brand-600/20 transition-all"
              >
                Staff Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 pt-16 pb-16 sm:pt-24 sm:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl w-full">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 border border-red-200 text-red-600 text-xs font-bold mb-6 tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              24/7 EMERGENCY RESPONSE
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
              Fastest Emergency <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-red-600">
                Resource Allocation
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              When every second counts, HealthResQ connects you instantly with the nearest available hospitals and ambulances. Request emergency medical assistance below.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#request-form" className="px-8 py-3.5 text-sm font-bold text-white bg-red-600 hover:bg-red-500 active:bg-red-700 rounded-full shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2">
                <PhoneCall className="w-5 h-5" />
                Request Emergency Help
              </a>
              <Link to="/login" className="px-8 py-3.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-full shadow-sm transition-all flex items-center justify-center gap-2">
                System Access
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
              <div>
                <div className="text-3xl font-black text-slate-900">{'< 5m'}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1.5">Response Time</div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900">50+</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1.5">Network Hospitals</div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900">200+</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1.5">Active Ambulances</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6" id="request-form">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl relative overflow-hidden">
              
              {/* Top highlight */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
              
              <div className="p-6 sm:p-8 relative z-10">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                  <AlertTriangle className="text-red-500 w-5 h-5" />
                  Emergency Request
                </h2>

                {createdEmergency ? (
                  <PublicTracker 
                    emergencyId={createdEmergency.id} 
                    onNew={() => setCreatedEmergency(null)} 
                  />
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Emergency Type</label>
                      <select 
                        value={form.emergencyType}
                        onChange={e => setForm({...form, emergencyType: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all appearance-none"
                      >
                        <option>Medical Emergency</option>
                        <option>Road Accident</option>
                        <option>Fire Accident</option>
                        <option>Cardiac Arrest</option>
                        <option>Maternal Emergency</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Pickup Location <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          required
                          type="text" 
                          value={form.location}
                          onChange={e => setForm({...form, location: e.target.value})}
                          placeholder="Detailed address or landmark"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Priority Level</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Critical', 'High', 'Medium'].map(level => {
                          const isActive = form.priority === level;
                          return (
                            <button
                              key={level}
                              type="button"
                              onClick={() => setForm({...form, priority: level})}
                              className={clsx(
                                "py-2 rounded-xl text-xs font-bold border transition-all",
                                isActive 
                                  ? level === 'Critical' ? 'bg-red-50 text-red-600 border-red-300' 
                                    : level === 'High' ? 'bg-orange-50 text-orange-600 border-orange-300' 
                                    : 'bg-yellow-50 text-yellow-600 border-yellow-300'
                                  : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'
                              )}
                            >
                              {level}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Additional Notes</label>
                      <textarea 
                        value={form.notes}
                        onChange={e => setForm({...form, notes: e.target.value})}
                        placeholder="Any specific condition details, blood group, etc."
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all h-20 resize-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={requestMutation.isPending}
                      className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-red-600/20 mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                      {requestMutation.isPending ? 'Broadcasting...' : (
                        <>
                          <Clock className="w-4 h-4 animate-pulse" />
                          Broadcast Emergency Now
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
