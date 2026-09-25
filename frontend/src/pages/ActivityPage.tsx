import React, { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getActivityLogs } from '../api/client';
import clsx from 'clsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ActivityPage() {
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : { role: 'System Admin', name: 'System User' };
  
  // Default module filter based on role
  let initialModule = 'All Modules';
  if (currentUser.role === 'Hospital Admin') initialModule = 'Hospitals';
  if (currentUser.role === 'Ambulance Operator') initialModule = 'Ambulances';
  if (currentUser.role === 'Emergency Coordinator') initialModule = 'Emergency';

  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState(initialModule);

  const { data: allLogs = [], isLoading } = useQuery({
    queryKey: ['activities', moduleFilter, search],
    queryFn: () => getActivityLogs(search, moduleFilter),
    refetchInterval: 5000
  });

  // Only show activities that belong to the current user's role (module)
  const logs = allLogs.filter((log: any) => log.user === currentUser.role);

  const modulesList = ['All Modules', 'Auth', 'Users', 'Hospitals', 'Hospital Resources', 'Ambulances', 'Emergency', 'System'];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'System Admin': return 'text-blue-400 bg-blue-900/30';
      case 'Hospital Admin': return 'text-emerald-400 bg-emerald-900/30';
      case 'Emergency Coordinator': return 'text-red-400 bg-red-900/30';
      case 'Ambulance Operator': return 'text-slate-300 bg-slate-800';
      default: return 'text-slate-400 bg-slate-800';
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Activity Logs - ${moduleFilter}`, 14, 15);
    
    const tableColumn = ["Timestamp", "User", "Role", "Action", "Module", "Target", "Result"];
    const tableRows: any[] = [];

    logs.forEach((log: any) => {
      const timestamp = new Date(log.timestamp).toISOString().replace('T', ' ').substring(0, 16);
      const userName = log.user === currentUser.role ? currentUser.name : (log.user === 'System Admin' ? 'Dr. Priya Sharma' : 'System User');
      
      const rowData = [
        timestamp,
        userName,
        log.user,
        log.action,
        log.module,
        log.refId || '—',
        'Success'
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    
    doc.save(`Activity_Log_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="min-h-full py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">System Activity</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Administrative audit log — {logs.length} entries
            </p>
          </div>
          <button onClick={handleExportPDF} className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" /> Export Log
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by action or target..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            <select
              value={moduleFilter}
              onChange={e => setModuleFilter(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              {modulesList.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                {['TIMESTAMP', 'USER', 'ROLE', 'ACTION', 'MODULE', 'TARGET', 'RESULT'].map(h => (
                  <th key={h} className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toISOString().replace('T', ' ').substring(0, 16)}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                    {/* Backend only stores 'user' as Role right now. We use currentUser name for currently matching roles, or generic otherwise */}
                    {log.user === currentUser.role ? currentUser.name : (log.user === 'System Admin' ? 'Dr. Priya Sharma' : 'System User')}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={clsx('px-2.5 py-1 rounded-md text-[11px] font-medium border border-transparent dark:border-slate-700/50', getRoleColor(log.user))}>
                      {log.user}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {log.module}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {log.refId || '—'}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Success
                    </div>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-slate-500">
                    No activity logs found for this module.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
