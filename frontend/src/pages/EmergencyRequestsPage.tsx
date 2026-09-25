import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getEmergencies, acknowledgeEmergency } from '../api/client';
import { Plus, Search, ChevronDown, X, Building2, Ambulance, MapPin, User, Activity } from 'lucide-react';
import clsx from 'clsx';
import { useQueryClient } from '@tanstack/react-query';

type PriorityType = 'All Priorities' | 'Critical' | 'High' | 'Medium';
type StatusType = 'All Statuses' | 'Pending' | 'Acknowledged' | 'Assigned' | 'In Progress' | 'Completed';
type SortType = 'Sort: Priority' | 'Sort: Created';

type EmergencyReq = {
  id: string;
  patientId: string;
  type: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  location: string;
  resources: string[];
  hospital: string;
  ambulance: string;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'ASSIGNED' | 'IN PROGRESS' | 'COMPLETED';
  created: string;
};

const REQUESTS_DATA: EmergencyReq[] = [];

export default function EmergencyRequestsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityType>('All Priorities');
  const [statusFilter, setStatusFilter] = useState<StatusType>('All Statuses');
  const [sortBy, setSortBy] = useState<SortType>('Sort: Priority');

  const [priorityOpen, setPriorityOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const { data: emergenciesData = [], isLoading } = useQuery({
    queryKey: ['emergencies'],
    queryFn: () => getEmergencies(),
    refetchInterval: 5000,
  });

  const formattedData = emergenciesData.map((req: any) => ({
    id: req.requestCode,
    patientId: req.patientId,
    type: req.emergencyType,
    priority: req.priority.toUpperCase(),
    location: req.location,
    resources: req.requiredResources || [],
    hospital: req.hospital?.name || req.hospitalId || 'Not Assigned', 
    ambulance: req.trip?.ambulance?.vehicleNo || req.ambulance?.vehicleNo || req.ambulanceId || '—',
    status: req.status.toUpperCase(),
    created: new Date(req.createdAt).toLocaleTimeString(),
    dbId: req.id,
    fullData: req
  }));

  const filtered = formattedData.filter((req: any) => {
    const matchesSearch = !search ||
      req.id.toLowerCase().includes(search.toLowerCase()) ||
      req.patientId.toLowerCase().includes(search.toLowerCase()) ||
      req.type.toLowerCase().includes(search.toLowerCase()) ||
      req.location.toLowerCase().includes(search.toLowerCase());

    const matchesPriority = priorityFilter === 'All Priorities' || req.priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All Statuses' || req.status.replace(' ', '').toLowerCase() === statusFilter.replace(' ', '').toLowerCase();

    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div 
      className="space-y-6 max-w-7xl mx-auto pb-16"
      onClick={() => { setPriorityOpen(false); setStatusOpen(false); setSortOpen(false); }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Emergency Requests</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">7 active • 3 pending assignment</p>
        </div>
        <button
          onClick={() => navigate('/emergency-requests/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Emergency
        </button>
      </div>

      {/* Toolbar / Search & Dropdown Filters */}
      <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, patient, type, location..."
            className="block w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Priority Filter Dropdown */}
        <div className="relative" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => { setPriorityOpen(!priorityOpen); setStatusOpen(false); setSortOpen(false); }}
            className="flex items-center justify-between gap-3 px-3.5 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap min-w-[130px]"
          >
            <span>{priorityFilter}</span>
            <ChevronDown className={clsx('w-3.5 h-3.5 text-gray-400 transition-transform', priorityOpen && 'rotate-180')} />
          </button>
          {priorityOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#131b2e] border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
              {(['All Priorities', 'Critical', 'High', 'Medium'] as PriorityType[]).map(p => (
                <button
                  key={p}
                  onClick={() => { setPriorityFilter(p); setPriorityOpen(false); }}
                  className={clsx(
                    'block w-full text-left px-4 py-2 text-xs font-medium transition-colors',
                    priorityFilter === p ? 'bg-blue-600 text-white font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => { setStatusOpen(!statusOpen); setPriorityOpen(false); setSortOpen(false); }}
            className="flex items-center justify-between gap-3 px-3.5 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap min-w-[130px]"
          >
            <span>{statusFilter}</span>
            <ChevronDown className={clsx('w-3.5 h-3.5 text-gray-400 transition-transform', statusOpen && 'rotate-180')} />
          </button>
          {statusOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#131b2e] border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
              {(['All Statuses', 'Pending', 'Acknowledged', 'Assigned', 'In Progress', 'Completed'] as StatusType[]).map(s => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setStatusOpen(false); }}
                  className={clsx(
                    'block w-full text-left px-4 py-2 text-xs font-medium transition-colors',
                    statusFilter === s ? 'bg-blue-600 text-white font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => { setSortOpen(!sortOpen); setPriorityOpen(false); setStatusOpen(false); }}
            className="flex items-center justify-between gap-3 px-3.5 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap min-w-[130px]"
          >
            <span>{sortBy}</span>
            <ChevronDown className={clsx('w-3.5 h-3.5 text-gray-400 transition-transform', sortOpen && 'rotate-180')} />
          </button>
          {sortOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#131b2e] border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
              {(['Sort: Priority', 'Sort: Created'] as SortType[]).map(st => (
                <button
                  key={st}
                  onClick={() => { setSortBy(st); setSortOpen(false); }}
                  className={clsx(
                    'block w-full text-left px-4 py-2 text-xs font-medium transition-colors',
                    sortBy === st ? 'bg-blue-600 text-white font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                  )}
                >
                  {st}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Requests Table Box */}
      <div className="bg-white dark:bg-slate-850 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3.5">REQUEST ID</th>
                <th className="px-5 py-3.5">EMERGENCY TYPE</th>
                <th className="px-5 py-3.5">PRIORITY</th>
                <th className="px-5 py-3.5">LOCATION</th>
                <th className="px-5 py-3.5">REQUIRED RESOURCES</th>
                <th className="px-5 py-3.5">HOSPITAL</th>
                <th className="px-5 py-3.5">AMBULANCE</th>
                <th className="px-5 py-3.5">STATUS</th>
                <th className="px-5 py-3.5">CREATED</th>
                <th className="px-5 py-3.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60 text-xs">
              {filtered.map(req => (
                <tr key={req.id} className="hover:bg-gray-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  {/* Request ID + Patient */}
                  <td className="px-5 py-4">
                    <p className="font-bold text-blue-600 dark:text-blue-400">{req.id}</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{req.patientId}</p>
                  </td>

                  {/* Type */}
                  <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    {req.type}
                  </td>

                  {/* Priority */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={clsx(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                      req.priority === 'CRITICAL' && "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400",
                      req.priority === 'HIGH' && "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400",
                      req.priority === 'MEDIUM' && "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400"
                    )}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {req.priority}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {req.location}
                  </td>

                  {/* Required Resources */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex gap-1">
                      {req.resources.map((r, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Hospital */}
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {req.hospital}
                  </td>

                  {/* Ambulance */}
                  <td className="px-5 py-4 font-mono text-[11px] text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {req.ambulance}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase",
                      req.status === 'PENDING' && "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700",
                      req.status === 'ACKNOWLEDGED' && "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/40",
                      req.status === 'IN PROGRESS' && "bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-900/40",
                      req.status === 'ASSIGNED' && "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40",
                      req.status === 'COMPLETED' && "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40"
                    )}>
                      {req.status}
                    </span>
                  </td>

                  {/* Created */}
                  <td className="px-5 py-4 text-gray-400 font-mono text-[11px] whitespace-nowrap">
                    {req.created}
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    {req.status === 'PENDING' ? (
                      <button 
                        onClick={async () => {
                          const storedUser = localStorage.getItem('user');
                          const currentUser = storedUser ? JSON.parse(storedUser) : { name: 'Coordinator' };
                          await acknowledgeEmergency(req.dbId, currentUser.name);
                          queryClient.invalidateQueries({ queryKey: ['emergencies'] });
                        }}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                      >
                        Acknowledge
                      </button>
                    ) : req.status === 'ACKNOWLEDGED' ? (
                      <button 
                        onClick={() => navigate(`/resource-matching?id=${req.dbId}`)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                      >
                        Coordinate
                      </button>
                    ) : req.status === 'COMPLETED' ? (
                      <button 
                        onClick={() => setSelectedRequest(req)}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Details
                      </button>
                    ) : (
                      <button 
                        onClick={() => setSelectedRequest(req)}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 text-xs font-semibold rounded-lg transition-colors"
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-slate-800 text-xs text-gray-500 font-medium">
          Showing {filtered.length} of {formattedData.length} requests
        </div>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Emergency Details
                  <span className={clsx(
                    "px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider",
                    selectedRequest.priority === 'CRITICAL' && "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50",
                    selectedRequest.priority === 'HIGH' && "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50",
                    selectedRequest.priority === 'MEDIUM' && "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50"
                  )}>
                    {selectedRequest.priority}
                  </span>
                </h2>
                <p className="text-sm text-slate-500 font-mono mt-1">{selectedRequest.id} • {selectedRequest.created}</p>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
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
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedRequest.hospital}</p>
                  {selectedRequest.hospital !== 'Not Assigned' && (
                    <p className="text-sm text-slate-500 mt-1">Status: <span className="font-semibold text-blue-600">{selectedRequest.status}</span></p>
                  )}
                </div>
                
                <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                    <Ambulance className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Assigned Ambulance</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">{selectedRequest.ambulance}</p>
                  {selectedRequest.ambulance !== '—' && (
                    <p className="text-sm text-slate-500 mt-1">Trip Status: <span className="font-semibold text-emerald-600">{selectedRequest.fullData.trip?.status || 'Unknown'}</span></p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">Emergency Info</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Patient ID</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">{selectedRequest.patientId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Emergency Type</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedRequest.type}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Location</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedRequest.location}</p>
                  </div>
                </div>

                {selectedRequest.resources && selectedRequest.resources.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-slate-500 mb-2">Required Resources</p>
                    <div className="flex gap-2">
                      {selectedRequest.resources.map((res: string, i: number) => (
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
                onClick={() => setSelectedRequest(null)}
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
