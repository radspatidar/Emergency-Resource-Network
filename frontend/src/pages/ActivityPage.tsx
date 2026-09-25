import React from 'react';
import { FileCheck, CheckSquare, Navigation2, MapPin } from 'lucide-react';

// ─── Operator Activity ────────────────────────────────────────────────────────
type OpActivity = { time: string; icon: 'assign' | 'check' | 'trip' | 'pin'; text: string; req: string };

const operatorActivities: OpActivity[] = [
  { time: '10:42 AM', icon: 'assign', text: 'Assignment ER-001 received', req: 'ER-001' },
  { time: '10:45 AM', icon: 'check',  text: 'Assignment ER-001 accepted', req: 'ER-001' },
  { time: '10:48 AM', icon: 'trip',   text: 'Trip ER-001 started',        req: 'ER-001' },
  { time: '10:51 AM', icon: 'pin',    text: 'Location updated to 22.7205, 75.8590', req: 'ER-001' },
  { time: '10:55 AM', icon: 'pin',    text: 'Location updated to 22.7230, 75.8615', req: 'ER-001' },
];

function OpIcon({ type }: { type: OpActivity['icon'] }) {
  const base = 'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0';
  if (type === 'assign') return <div className={`${base} bg-orange-100 dark:bg-orange-900/30`}><FileCheck  className="w-4 h-4 text-orange-500" /></div>;
  if (type === 'check')  return <div className={`${base} bg-emerald-100 dark:bg-emerald-900/30`}><CheckSquare className="w-4 h-4 text-emerald-500" /></div>;
  if (type === 'trip')   return <div className={`${base} bg-blue-100 dark:bg-blue-900/30`}><Navigation2 className="w-4 h-4 text-blue-500" /></div>;
  return                        <div className={`${base} bg-red-100 dark:bg-red-900/30`}><MapPin      className="w-4 h-4 text-red-500" /></div>;
}

function OperatorActivity() {
  return (
    <div className="min-h-full py-8 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Activity Log</h1>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
            Operator activity for Ambulance A001
          </p>
        </div>

        {/* Activity list */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {operatorActivities.map((a, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30 ${
                i !== operatorActivities.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''
              }`}
            >
              {/* Timestamp — fixed width so all icons align */}
              <span className="text-[11px] font-mono font-medium text-slate-400 w-16 flex-shrink-0 text-right">
                {a.time}
              </span>

              {/* Icon */}
              <OpIcon type={a.icon} />

              {/* Description — fills remaining space */}
              <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300 leading-snug">
                {a.text}
              </span>

              {/* ER link — fixed right */}
              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 cursor-pointer flex-shrink-0">
                {a.req}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Coordinator / General Activity ──────────────────────────────────────────
const coordinatorActivities = [
  { id: 1,  time: '10:47 AM', user: 'Ambulance Operator', action: 'Trip Started',         req: 'ER-1024', hosp: 'City Care Hospital',      amb: 'A-003' },
  { id: 2,  time: '10:45 AM', user: 'EC-COORD-01',        action: 'Assignment Confirmed', req: 'ER-1022', hosp: 'Apollo Emergency Center',  amb: 'A-002' },
  { id: 3,  time: '10:38 AM', user: 'EC-COORD-01',        action: 'Assignment Confirmed', req: 'ER-1024', hosp: 'City Care Hospital',      amb: 'A-003' },
  { id: 4,  time: '10:35 AM', user: 'EC-COORD-01',        action: 'Assignment Confirmed', req: 'ER-1023', hosp: 'Metro General Hospital',  amb: 'A-007' },
  { id: 5,  time: '10:42 AM', user: 'EC-COORD-01',        action: 'Emergency Created',    req: 'ER-1025', hosp: '—',                       amb: '—'     },
  { id: 6,  time: '10:25 AM', user: 'Ambulance Operator', action: 'Trip Started',         req: 'ER-1022', hosp: 'Apollo Emergency Center',  amb: 'A-002' },
  { id: 7,  time: '10:14 AM', user: 'EC-COORD-01',        action: 'Assignment Confirmed', req: 'ER-1022', hosp: 'Apollo Emergency Center',  amb: 'A-002' },
  { id: 8,  time: '10:22 AM', user: 'System',             action: 'Emergency Completed',  req: 'ER-1019', hosp: 'City Care Hospital',      amb: 'A-009' },
  { id: 9,  time: '10:01 AM', user: 'EC-COORD-01',        action: 'Assignment Confirmed', req: 'ER-1020', hosp: 'Cityline Medical',        amb: 'A-011' },
  { id: 10, time: '09:21 AM', user: 'EC-COORD-01',        action: 'Assignment Confirmed', req: 'ER-1019', hosp: 'City Care Hospital',      amb: 'A-009' },
];

function CoordinatorActivity() {
  return (
    <div className="min-h-full py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Activity</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Coordination history and audit trail for all emergency operations.
          </p>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                {['TIMESTAMP', 'USER', 'ACTION', 'REQUEST', 'HOSPITAL', 'AMBULANCE', 'RESULT'].map(h => (
                  <th key={h} className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {coordinatorActivities.map(a => (
                <tr key={a.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">{a.time}</td>
                  <td className={`px-5 py-3.5 font-mono text-xs font-bold whitespace-nowrap ${
                    a.user === 'Ambulance Operator' ? 'text-emerald-600 dark:text-emerald-500' :
                    a.user === 'EC-COORD-01'        ? 'text-blue-600 dark:text-blue-500' :
                                                      'text-slate-600 dark:text-slate-400'
                  }`}>{a.user}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">{a.action}</td>
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap cursor-pointer hover:text-blue-700">{a.req}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{a.hosp}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{a.amb}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400">
                      SUCCESS
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Root export (role-aware) ──────────────────────────────────────────────
export default function ActivityPage() {
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : {};
  return currentUser.role === 'Ambulance Operator'
    ? <OperatorActivity />
    : <CoordinatorActivity />;
}
