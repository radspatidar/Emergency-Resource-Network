import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

type PriorityType = 'All Priorities' | 'Critical' | 'High' | 'Medium';
type StatusType = 'All Statuses' | 'Pending' | 'Assigned' | 'In Progress' | 'Completed';
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
  status: 'PENDING' | 'ASSIGNED' | 'IN PROGRESS' | 'COMPLETED';
  created: string;
};

const REQUESTS_DATA: EmergencyReq[] = [
  { id: 'ER-1025', patientId: 'P-501', type: 'Road Accident', priority: 'CRITICAL', location: 'Indore, Madhya Pradesh', resources: ['ICU', 'Vent', 'Doctor'], hospital: 'Not Assigned', ambulance: '—', status: 'PENDING', created: '10:42 AM' },
  { id: 'ER-1022', patientId: 'P-475', type: 'Trauma', priority: 'CRITICAL', location: 'Ujjain, Madhya Pradesh', resources: ['ICU', 'Vent', 'Doctor'], hospital: 'Apollo Emergency', ambulance: 'A-002', status: 'IN PROGRESS', created: '10:10 AM' },
  { id: 'ER-1021', patientId: 'P-461', type: 'Stroke', priority: 'CRITICAL', location: 'Jabalpur, Madhya Pradesh', resources: ['ICU', 'Doctor'], hospital: 'Not Assigned', ambulance: '—', status: 'PENDING', created: '10:05 AM' },
  { id: 'ER-1024', patientId: 'P-499', type: 'Cardiac Emergency', priority: 'HIGH', location: 'Bhopal, Madhya Pradesh', resources: ['ICU', 'Doctor'], hospital: 'City Care Hospital', ambulance: 'A-003', status: 'IN PROGRESS', created: '10:36 AM' },
  { id: 'ER-1023', patientId: 'P-487', type: 'Respiratory Emergency', priority: 'HIGH', location: 'Indore, Madhya Pradesh', resources: ['Vent', 'Doctor'], hospital: 'Metro General Hospital', ambulance: 'A-007', status: 'ASSIGNED', created: '10:28 AM' },
  { id: 'ER-1018', patientId: 'P-421', type: 'Burns', priority: 'HIGH', location: 'Bhopal, Madhya Pradesh', resources: ['ICU', 'Doctor'], hospital: 'Not Assigned', ambulance: '—', status: 'PENDING', created: '09:44 AM' },
  { id: 'ER-1020', patientId: 'P-448', type: 'Cardiac Emergency', priority: 'MEDIUM', location: 'Gwalior, Madhya Pradesh', resources: ['ICU', 'Doctor'], hospital: 'Cityline Medical', ambulance: 'A-011', status: 'ASSIGNED', created: '09:52 AM' },
  { id: 'ER-1019', patientId: 'P-432', type: 'Road Accident', priority: 'MEDIUM', location: 'Indore, Madhya Pradesh', resources: ['Doctor'], hospital: 'City Care Hospital', ambulance: 'A-009', status: 'COMPLETED', created: '09:18 AM' },
];

export default function EmergencyRequestsPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityType>('All Priorities');
  const [statusFilter, setStatusFilter] = useState<StatusType>('All Statuses');
  const [sortBy, setSortBy] = useState<SortType>('Sort: Priority');

  const [priorityOpen, setPriorityOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = REQUESTS_DATA.filter(req => {
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
              {(['All Statuses', 'Pending', 'Assigned', 'In Progress', 'Completed'] as StatusType[]).map(s => (
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
                        onClick={() => navigate('/resource-matching')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                      >
                        Coordinate
                      </button>
                    ) : req.status === 'COMPLETED' ? (
                      <button className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 text-xs font-semibold rounded-lg transition-colors">
                        Details
                      </button>
                    ) : (
                      <button className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 text-xs font-semibold rounded-lg transition-colors">
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
          Showing {filtered.length} of {REQUESTS_DATA.length} requests
        </div>
      </div>
    </div>
  );
}
