import React, { useState } from 'react';
import { ArrowDown, X, Building2, Ambulance, MapPin, User, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getEmergencies } from '../api/client';

export default function Assignments() {
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const { data: emergenciesData = [] } = useQuery({
    queryKey: ['emergencies'],
    queryFn: () => getEmergencies(),
    refetchInterval: 5000,
  });

  const assignmentsData = emergenciesData
    .filter((req: any) => req.status !== 'Pending' && req.status !== 'Acknowledged')
    .map((req: any) => ({
      id: req.trip?.tripCode || 'ASN-000',
      reqId: req.requestCode,
      hospital: req.hospital?.name || req.hospitalId || 'Unknown',
      amb: req.trip?.ambulance?.vehicleNo || req.ambulance?.vehicleNo || req.ambulanceId || 'Unknown',
      priority: req.priority.toUpperCase(),
      time: new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: req.status.toUpperCase(),
      fullData: req,
    }));
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50';
      case 'HIGH': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500 dark:border-yellow-800/50';
      case 'MEDIUM': return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50';
      default: return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN PROGRESS': return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50';
      case 'ASSIGNED': return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50';
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50';
      default: return 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800/50';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Assignments</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">All confirmed emergency assignments and their current status.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">TOTAL</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{assignmentsData.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">ASSIGNED</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-500">
            {assignmentsData.filter((a: any) => a.status === 'ASSIGNED').length}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">IN PROGRESS</div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">
            {assignmentsData.filter((a: any) => a.status === 'IN PROGRESS').length}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">COMPLETED</div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">
            {assignmentsData.filter((a: any) => a.status === 'COMPLETED').length}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">ASSIGNMENT ID</th>
                <th className="px-6 py-4">EMERGENCY</th>
                <th className="px-6 py-4">HOSPITAL</th>
                <th className="px-6 py-4">AMBULANCE</th>
                <th className="px-6 py-4">PRIORITY</th>
                <th className="px-6 py-4">ASSIGNED AT</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
              {assignmentsData.map((a: any) => (
                <tr key={a.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-slate-900 dark:text-white font-mono text-xs font-bold">{a.id}</td>
                  <td className="px-6 py-4 text-blue-600 dark:text-blue-400 font-mono text-xs">{a.reqId}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{a.hospital}</td>
                  <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300 text-xs">{a.amb}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-wider ${getPriorityColor(a.priority)}`}>
                      {a.priority === 'HIGH' && '▲ '}
                      {a.priority === 'MEDIUM' && '♦ '}
                      {a.priority === 'CRITICAL' && '● '}
                      {a.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{a.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(a.status)}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setSelectedAssignment(a)}
                      className="px-3 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 text-xs font-bold transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-6">Active Assignment Overview</h2>
        
        <div className="grid grid-cols-3 gap-6">
          {assignmentsData.filter((a: any) => a.status !== 'COMPLETED').map((a: any) => (
            <div key={a.id} className="flex flex-col items-center p-4 border border-slate-100 dark:border-slate-800/80 rounded-xl bg-slate-50/50 dark:bg-slate-800/20">
              <div className="w-full text-center py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg shadow-sm mb-2">
                <div className="font-mono text-sm text-slate-900 dark:text-white font-bold mb-1">{a.reqId}</div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider inline-block ${getPriorityColor(a.priority)}`}>
                  {a.priority === 'HIGH' && '▲ '}
                  {a.priority === 'CRITICAL' && '● '}
                  {a.priority}
                </span>
              </div>
              
              <ArrowDown className="w-4 h-4 text-slate-300 dark:text-slate-600 mb-2" />
              
              <div className="w-full text-center py-2.5 border border-blue-200 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg mb-2">
                <div className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  {a.hospital.replace(' Hospital', '').replace(' Center', '')}
                </div>
              </div>
              
              <ArrowDown className="w-4 h-4 text-slate-300 dark:text-slate-600 mb-2" />
              
              <div className="w-full text-center py-2.5 border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-lg mb-4">
                <div className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {a.amb}
                </div>
              </div>

              <span className={`px-3 py-1 rounded text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(a.status)}`}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {selectedAssignment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Assignment Details
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getPriorityColor(selectedAssignment.priority)}`}>
                    {selectedAssignment.priority}
                  </span>
                </h2>
                <p className="text-sm text-slate-500 font-mono mt-1">{selectedAssignment.id} • {selectedAssignment.reqId}</p>
              </div>
              <button 
                onClick={() => setSelectedAssignment(null)}
                className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                    <Building2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Destination Hospital</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedAssignment.hospital}</p>
                  <p className="text-sm text-slate-500 mt-1">{selectedAssignment.fullData.location}</p>
                </div>
                
                <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                    <Ambulance className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Assigned Ambulance</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">{selectedAssignment.amb}</p>
                  <p className="text-sm text-slate-500 mt-1">Status: <span className="font-semibold text-emerald-600">{selectedAssignment.status}</span></p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">Emergency Info</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Patient ID</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">{selectedAssignment.fullData.patientId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Emergency Type</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedAssignment.fullData.emergencyType}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Location</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedAssignment.fullData.location}</p>
                  </div>
                </div>

                {selectedAssignment.fullData.requiredResources && selectedAssignment.fullData.requiredResources.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-slate-500 mb-2">Required Resources</p>
                    <div className="flex gap-2">
                      {selectedAssignment.fullData.requiredResources.map((res: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-medium border border-slate-200 dark:border-slate-700">
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 flex justify-end border-t border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => setSelectedAssignment(null)}
                className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
