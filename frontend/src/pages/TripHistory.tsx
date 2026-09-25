import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const trips = [
  { id: 'TRIP-003', emergency: 'ER-003', priority: 'HIGH', destination: 'General Hospital', start: '08:30 AM', end: '09:15 AM' },
  { id: 'TRIP-002', emergency: 'ER-002', priority: 'MEDIUM', destination: 'St. Mary Hospital', start: '02:15 PM', end: '02:55 PM' },
  { id: 'TRIP-001', emergency: 'ER-001', priority: 'CRITICAL', destination: 'City Hospital', start: '10:48 AM', end: '11:05 AM' },
];

export default function TripHistory() {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');

  const filtered = trips.filter(t => {
    const matchesSearch = !search || t.id.toLowerCase().includes(search.toLowerCase()) || t.emergency.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === 'All Priorities' || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const priorityBadge = (p: string) => {
    if (p === 'CRITICAL') return 'bg-red-500 text-white';
    if (p === 'HIGH') return 'bg-orange-500 text-white';
    if (p === 'MEDIUM') return 'bg-blue-500 text-white';
    return 'bg-slate-400 text-white';
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 pt-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Trip History</h1>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Trip ID or Emergency ID..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>
        <div className="relative">
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="appearance-none pl-9 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer pr-8"
          >
            <option>All Priorities</option>
            <option>CRITICAL</option>
            <option>HIGH</option>
            <option>MEDIUM</option>
            <option>LOW</option>
          </select>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500">
              <th className="px-6 py-4">Trip ID</th>
              <th className="px-6 py-4">Emergency</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Destination</th>
              <th className="px-6 py-4">Start</th>
              <th className="px-6 py-4">End</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-sm text-blue-600 dark:text-blue-400">{t.id}</td>
                <td className="px-6 py-4 font-mono text-sm font-bold text-slate-900 dark:text-white">{t.emergency}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${priorityBadge(t.priority)}`}>
                    {t.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">{t.destination}</td>
                <td className="px-6 py-4 font-mono text-xs font-medium text-slate-600 dark:text-slate-400">{t.start}</td>
                <td className="px-6 py-4 font-mono text-xs font-medium text-slate-600 dark:text-slate-400">{t.end}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Completed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] font-medium text-slate-500">
          <span>Showing {filtered.length} of {trips.length} trips</span>
          <span>Ambulance A001 — Operator: Rahul Sharma</span>
        </div>
      </div>
    </div>
  );
}
