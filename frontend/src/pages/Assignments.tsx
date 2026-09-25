import React from 'react';
import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const assignmentsData = [
  { id: 'ASN-004', reqId: 'ER-1024', hospital: 'City Care Hospital', amb: 'A-003', priority: 'HIGH', time: '10:38 AM', status: 'IN PROGRESS' },
  { id: 'ASN-003', reqId: 'ER-1023', hospital: 'Metro General Hospital', amb: 'A-007', priority: 'HIGH', time: '10:35 AM', status: 'ASSIGNED' },
  { id: 'ASN-002', reqId: 'ER-1022', hospital: 'Apollo Emergency Center', amb: 'A-002', priority: 'CRITICAL', time: '10:14 AM', status: 'IN PROGRESS' },
  { id: 'ASN-001', reqId: 'ER-1019', hospital: 'City Care Hospital', amb: 'A-009', priority: 'MEDIUM', time: '09:21 AM', status: 'COMPLETED' },
];

export default function Assignments() {
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
          <div className="text-3xl font-bold text-slate-900 dark:text-white">4</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">ASSIGNED</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-500">1</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">IN PROGRESS</div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">2</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">COMPLETED</div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">1</div>
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
              {assignmentsData.map(a => (
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
                    <button className="px-3 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 text-xs font-bold transition-colors">
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
          {assignmentsData.filter(a => a.status !== 'COMPLETED').map(a => (
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
    </div>
  );
}
