import React, { useState } from 'react';
import { ArrowLeft, Check, Star, X, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getEmergency, getResourceMatch, assignEmergency } from '../api/client';

const getCoordinates = (locationName: string = '') => {
  const loc = locationName.toLowerCase();
  if (loc.includes('bholaram')) return { lat: 22.695, lng: 75.865 };
  if (loc.includes('choithram')) return { lat: 22.685, lng: 75.855 };
  if (loc.includes('bombay')) return { lat: 22.755, lng: 75.905 };
  if (loc.includes('apollo')) return { lat: 22.735, lng: 75.885 };
  return { lat: 22.7196, lng: 75.8577 }; // Default Indore
};

const getDistance = (loc1: {lat: number, lng: number}, loc2: {lat: number, lng: number}) => {
  return Math.sqrt(Math.pow(loc1.lat - loc2.lat, 2) + Math.pow(loc1.lng - loc2.lng, 2));
};

export default function ResourceMatching() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emergencyId = searchParams.get('id');

  const { data: emergency } = useQuery({
    queryKey: ['emergency', emergencyId],
    queryFn: () => getEmergency(emergencyId as string),
    enabled: !!emergencyId
  });

  const { data: matchData } = useQuery({
    queryKey: ['match', emergencyId],
    queryFn: () => getResourceMatch(emergencyId as string),
    enabled: !!emergencyId
  });

  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hospitals = matchData?.hospitals || [];
  const ambulances = matchData?.ambulances || [];

  const sortedHospitals = [...hospitals].sort((a: any, b: any) => {
    const d1 = getDistance(getCoordinates(emergency?.location), getCoordinates(a.name));
    const d2 = getDistance(getCoordinates(emergency?.location), getCoordinates(b.name));
    return d1 - d2;
  });

  const recommendedHospital = sortedHospitals.find((h: any) => h.suitable) || sortedHospitals[0];
  const recommendedAmbulance = ambulances.find((a: any) => a.status.toUpperCase() === 'AVAILABLE') || ambulances[0];

  const selectedHospital = hospitals.find((h: any) => h.id === selectedHospitalId);
  const selectedAmbulance = ambulances.find((a: any) => a.id === selectedAmbulanceId);

  const handleConfirm = async () => {
    if (!emergencyId || !selectedHospitalId || !selectedAmbulanceId || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await assignEmergency(emergencyId, {
        hospitalId: selectedHospitalId,
        ambulanceId: selectedAmbulanceId
      });
      navigate('/assignments');
    } catch (err) {
      console.error(err);
      alert('Failed to assign emergency');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 2 && selectedHospital && selectedAmbulance) {
    return (
      <div className="max-w-4xl mx-auto pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setStep(1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Confirm Emergency Assignment</h1>
        </div>
        <p className="text-sm text-slate-500 mb-6">Review all details before finalizing.</p>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {/* Emergency Request Section */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Emergency Request</h3>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg font-bold text-slate-900 dark:text-white">{emergency?.requestCode || 'ER-...'}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">{emergency?.priority || 'CRITICAL'}</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">Road Accident • Indore, Madhya Pradesh</p>
            <p className="text-sm text-slate-500 mb-3">Patient: P-501</p>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">ICU Bed</span>
              <span className="px-2 py-1 rounded text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Ventilator</span>
              <span className="px-2 py-1 rounded text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Emergency Doctor</span>
            </div>
          </div>

          {/* Selected Hospital */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-blue-50/30 dark:bg-blue-900/10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Selected Hospital</h3>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{selectedHospital.name}</h4>
                <p className="text-sm text-slate-500">{selectedHospital.location}</p>
              </div>
              <button onClick={() => setStep(1)} className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-md">
                Change
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-sm mt-4">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Check className="w-4 h-4" /> ICU beds available ({selectedHospital.icuBeds})
              </div>
              <div className={`flex items-center gap-1.5 ${selectedHospital.ventilators > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                {selectedHospital.ventilators > 0 ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} 
                Ventilators ({selectedHospital.ventilators})
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Check className="w-4 h-4" /> Emergency doctors ({selectedHospital.doctors})
              </div>
              <div className={`flex items-center gap-1.5 ${selectedHospital.emergencyDept ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                {selectedHospital.emergencyDept ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} Emergency dept
              </div>
            </div>
          </div>

          {/* Selected Ambulance */}
          <div className="p-6 bg-emerald-50/30 dark:bg-emerald-900/10 border-b border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">Selected Ambulance</h3>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{selectedAmbulance.vehicleNo || selectedAmbulance.id}</h4>
                <p className="text-sm text-slate-500 mb-3">Driver: {selectedAmbulance.driver}</p>
                <div className="inline-block bg-emerald-100/50 dark:bg-emerald-900/30 rounded p-1.5">
                  <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-0.5">Simulated Location</div>
                  <div className="text-sm font-mono text-emerald-800 dark:text-emerald-300">
                    {selectedAmbulance.lat}, {selectedAmbulance.lng}
                  </div>
                </div>
              </div>
              <button onClick={() => setStep(1)} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-md">
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Expected Status Changes */}
        <div className="mt-6 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10">
          <h3 className="text-[10px] font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wider mb-3">Expected Status Changes</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-slate-700 dark:text-slate-300">
              Emergency {emergency?.requestCode || 'ER-...'}: <span className="font-bold">PENDING → ASSIGNED</span>
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-300">
              Ambulance {selectedAmbulance.vehicleNo || selectedAmbulance.id}: <span className="font-bold">AVAILABLE → BUSY</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            disabled={isSubmitting}
            className={`px-6 py-2.5 rounded-lg font-bold transition-colors ${isSubmitting ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {isSubmitting ? 'Assigning...' : 'Confirm Assignment'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* Header Area */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Resource Matching</h1>
        <span className="text-sm font-medium text-slate-500">{emergency?.requestCode || 'ER-...'}</span>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">{emergency?.priority || 'CRITICAL'}</span>
      </div>
      
      <div className="ml-9 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
        Road Accident • Indore 
        <span className="text-slate-300 dark:text-slate-600 ml-1 mr-1">|</span>
        Required:
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800/60 dark:text-blue-400 dark:bg-blue-900/20">
          <Check className="w-3 h-3" /> ICU Bed
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800/60 dark:text-blue-400 dark:bg-blue-900/20">
          <Check className="w-3 h-3" /> Ventilator
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800/60 dark:text-blue-400 dark:bg-blue-900/20">
          <Check className="w-3 h-3" /> Emergency Doctor
        </span>
      </div>

      {/* Recommended Resources Banner */}
      <div className="mt-6 border border-blue-200 dark:border-blue-800 rounded-xl bg-blue-50/40 dark:bg-blue-900/10 p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm">
            <Star className="w-4 h-4" /> Recommended Resources
          </div>
          <div className="text-xs text-blue-500 dark:text-blue-400/70">
            Based on current availability — not a quality score
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedHospital && (
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-blue-100 dark:border-blue-800/50 shadow-sm">
              <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Nearest Suitable Hospital</div>
              <div className="font-bold text-slate-900 dark:text-white mb-3">{recommendedHospital.name}</div>
              <div className="space-y-1.5 text-sm text-emerald-700 dark:text-emerald-400">
                {recommendedHospital.availableIcu > 0 && <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5" /> ICU available ({recommendedHospital.availableIcu})</div>}
                {recommendedHospital.availableVentilators > 0 && <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5" /> Ventilators available ({recommendedHospital.availableVentilators})</div>}
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5" /> Emergency department active</div>
              </div>
            </div>
          )}
          {recommendedAmbulance && (
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-blue-100 dark:border-blue-800/50 shadow-sm">
              <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Nearest Available Ambulance</div>
              <div className="font-bold text-slate-900 dark:text-white mb-3">{recommendedAmbulance.vehicleNo}</div>
              <div className="space-y-1.5 text-sm text-emerald-700 dark:text-emerald-400">
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5" /> Status: {recommendedAmbulance.status}</div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5" /> Type: {recommendedAmbulance.type}</div>
              </div>
              <div className="mt-3 text-[10px] text-slate-400 font-mono">
                Simulated: {recommendedAmbulance.lat || 22.7196}, {recommendedAmbulance.lng || 75.8577}
              </div>
            </div>
          )}
        </div>
        <div className="mt-5">
          <button 
            onClick={() => {
              if (recommendedHospital) setSelectedHospitalId(recommendedHospital.id);
              if (recommendedAmbulance) setSelectedAmbulanceId(recommendedAmbulance.id);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
          >
            Use Recommended Resources
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hospitals Column */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Suitable Hospitals</h2>
            <span className="text-xs text-slate-500 font-medium">6 of 6</span>
          </div>
          <div className="space-y-3">
            {hospitals.map(h => {
              const isSelected = selectedHospitalId === h.id;
              
              const matchBadgeColor = h.matchStatus === 'FULL MATCH' 
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800/60'
                : 'text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800/60';
              
              const availBadgeColor = h.availabilityStatus === 'AVAILABLE'
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800/60'
                : h.availabilityStatus === 'FULL' 
                ? 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800/60'
                : 'text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800/60';

              return (
                <div 
                  key={h.id} 
                  className={`bg-white dark:bg-slate-900 rounded-xl p-5 transition-all border ${isSelected ? 'border-blue-500 ring-1 ring-blue-500 shadow-md' : 'border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 dark:text-white">{h.name}</h3>
                        {isSelected && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white flex items-center gap-1">
                            <Check className="w-3 h-3" /> SELECTED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{h.location}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${matchBadgeColor}`}>
                        {h.matchStatus}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${availBadgeColor}`}>
                        {h.availabilityStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 mb-4">
                    <div className={`text-xs flex items-center gap-1.5 ${h.icuBeds > 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-500'}`}>
                      {h.icuBeds > 0 ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      ICU Beds ({h.icuBeds})
                    </div>
                    <div className={`text-xs flex items-center gap-1.5 ${h.ventilators > 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-500'}`}>
                      {h.ventilators > 0 ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      Ventilators ({h.ventilators})
                    </div>
                    <div className={`text-xs flex items-center gap-1.5 ${h.doctors > 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-500'}`}>
                      {h.doctors > 0 ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      Doctors ({h.doctors})
                    </div>
                    <div className={`text-xs flex items-center gap-1.5 ${h.emergencyDept ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-500'}`}>
                      {h.emergencyDept ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      Emergency Dept
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span>Beds: <strong className="text-slate-600 dark:text-slate-300">{h.totalBeds}</strong></span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span>{h.updatedAgo}</span>
                    </div>
                    {isSelected ? (
                      <button className="px-4 py-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-800 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> Selected
                      </button>
                    ) : (
                      <button 
                        onClick={() => setSelectedHospitalId(h.id)}
                        className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                      >
                        Select Hospital
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ambulances Column */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Available Ambulances</h2>
            <span className="text-xs text-slate-500 font-medium">7 of 12</span>
          </div>
          <div className="space-y-3">
            {ambulances.map(a => {
              const isSelected = selectedAmbulanceId === a.id;
              const isAvailable = a.status?.toUpperCase() === 'AVAILABLE';

              return (
                <div 
                  key={a.id} 
                  className={`bg-white dark:bg-slate-900 rounded-xl p-5 transition-all border ${isSelected ? 'border-emerald-500 ring-1 ring-emerald-500 shadow-md' : 'border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'} ${!isAvailable && !isSelected ? 'opacity-70' : ''}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white">{a.vehicleNo || a.id}</h3>
                      {isSelected && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1">
                          <Check className="w-3 h-3" /> SELECTED
                        </span>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${isAvailable ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800/60' : 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800/60'}`}>
                      {a.status}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-500 mb-3">Driver: {a.driver}</p>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-800 mb-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                      <MapPin className="w-3 h-3" /> Simulated Location
                    </div>
                    <div className="text-xs font-mono text-slate-700 dark:text-slate-300 mb-1">
                      {a.lat}, {a.lng}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Updated: {a.updatedAgo}
                    </div>
                  </div>

                  {!isAvailable && !isSelected ? (
                    <div className="text-center py-1.5 text-xs text-slate-400">Currently busy</div>
                  ) : isSelected ? (
                    <button className="w-full py-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-800 flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4" /> Selected
                    </button>
                  ) : (
                    <button 
                      onClick={() => setSelectedAmbulanceId(a.id)}
                      className="w-full py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                    >
                      Select Ambulance
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] z-40 transition-all">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Assignment Summary</span>
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <div className={`w-1.5 h-1.5 rounded-full ${selectedHospital ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                Hospital: 
                <span className={`font-bold ${selectedHospital ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                  {selectedHospital ? selectedHospital.name : 'Not selected'}
                </span>
              </span>
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <div className={`w-1.5 h-1.5 rounded-full ${selectedAmbulance ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                Ambulance: 
                <span className={`font-bold ${selectedAmbulance ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                  {selectedAmbulance ? (selectedAmbulance.vehicleNo || selectedAmbulance.id) : 'Not selected'}
                </span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {(!selectedHospital || !selectedAmbulance) && (
              <span className="text-xs font-medium text-slate-400 hidden sm:inline-block">Select hospital and ambulance</span>
            )}
            <button 
              onClick={() => setStep(2)}
              disabled={!selectedHospital || !selectedAmbulance}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all w-full sm:w-auto ${selectedHospital && selectedAmbulance ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'}`}
            >
              Review Assignment <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
