import React, { useState } from 'react';
import { AlertTriangle, Navigation2, MapPin, Settings, Bell } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type OperatorNotif = {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type: 'critical' | 'trip' | 'location' | 'system';
  badge: string | null;
};

type GeneralNotif = {
  id: string;
  category: 'Critical' | 'Warning' | 'Info';
  time: string;
  text: string;
  reqId?: string;
  isRead: boolean;
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const OPERATOR_NOTIFICATIONS: OperatorNotif[] = [
  { id: '1', title: 'New Emergency Assignment', description: 'Emergency ER-001 has been assigned to Ambulance A001.', time: '10:42 AM', isRead: false, type: 'critical', badge: 'CRITICAL' },
  { id: '2', title: 'Trip Started Successfully', description: 'Trip for Emergency ER-001 started. En route to City Hospital.', time: '10:48 AM', isRead: false, type: 'trip', badge: null },
  { id: '3', title: 'Simulated Location Updated', description: 'Location updated to 22.7205, 75.8590.', time: '10:51 AM', isRead: true, type: 'location', badge: null },
  { id: '4', title: 'Emergency Assignment Updated', description: 'Emergency assignment status updated by dispatch.', time: '10:40 AM', isRead: true, type: 'system', badge: null },
];

const GENERAL_NOTIFICATIONS: GeneralNotif[] = [
  { id: '1', category: 'Critical', time: '10:42 AM', text: 'New critical emergency request ER-1025 — Road Accident in Indore.', reqId: 'ER-1025', isRead: false },
  { id: '2', category: 'Critical', time: '10:05 AM', text: 'New critical emergency request ER-1021 — Stroke in Jabalpur.', reqId: 'ER-1021', isRead: false },
  { id: '3', category: 'Warning', time: '10:40 AM', text: 'City Care Hospital: Only 8 ICU beds remaining.', isRead: false },
  { id: '4', category: 'Info', time: '10:47 AM', text: 'Assignment ER-1024 has entered In Progress status.', reqId: 'ER-1024', isRead: false },
  { id: '5', category: 'Info', time: '10:38 AM', text: 'Ambulance A-003 is now BUSY — assigned to ER-1024.', isRead: true },
  { id: '6', category: 'Warning', time: '10:30 AM', text: 'Central Hospital: No ventilators available.', isRead: true },
  { id: '7', category: 'Info', time: '10:22 AM', text: 'Emergency ER-1019 completed successfully.', reqId: 'ER-1019', isRead: true },
  { id: '8', category: 'Warning', time: '10:18 AM', text: 'Apollo Emergency Center: Only 2 ICU beds remaining.', isRead: true },
];

// ─── Operator Icon ────────────────────────────────────────────────────────────
function NotifIcon({ type }: { type: OperatorNotif['type'] }) {
  const cls = 'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0';
  if (type === 'critical') return <div className={`${cls} bg-red-100 dark:bg-red-900/30`}><AlertTriangle className="w-5 h-5 text-red-500" /></div>;
  if (type === 'trip')     return <div className={`${cls} bg-blue-100 dark:bg-blue-900/30`}><Navigation2 className="w-5 h-5 text-blue-500" /></div>;
  if (type === 'location') return <div className={`${cls} bg-red-100 dark:bg-red-900/30`}><MapPin className="w-5 h-5 text-red-500" /></div>;
  return                          <div className={`${cls} bg-slate-100 dark:bg-slate-800`}><Settings className="w-5 h-5 text-slate-500" /></div>;
}

// ─── Operator Notifications ───────────────────────────────────────────────────
function OperatorNotifications() {
  const [notifications, setNotifications] = useState<OperatorNotif[]>(OPERATOR_NOTIFICATIONS);
  const unread = notifications.filter(n => !n.isRead);

  const handleMarkAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  const handleDismiss = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));

  return (
    <div className="min-h-full py-8 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{unread.length} unread</p>
          </div>
          {unread.length > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mt-1"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`relative flex items-start gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border shadow-sm transition-all ${
                !n.isRead
                  ? 'border-blue-200 dark:border-blue-800/60'
                  : 'border-slate-200 dark:border-slate-800 opacity-70'
              }`}
            >
              {/* Left accent stripe */}
              {!n.isRead && (
                <div className="absolute left-0 inset-y-3 w-0.5 bg-blue-500 rounded-r-full" />
              )}

              {/* Icon */}
              <NotifIcon type={n.type} />

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-bold leading-snug ${!n.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                    {n.title}
                  </span>
                  {n.badge && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider leading-none">
                      {n.badge}
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${
                  n.type === 'trip' && !n.isRead
                    ? 'text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {n.description}
                </p>
              </div>

              {/* Right: time + dot */}
              <div className="flex items-center gap-2 flex-shrink-0 self-start pt-0.5">
                <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">{n.time}</span>
                {!n.isRead && (
                  <button
                    onClick={() => handleDismiss(n.id)}
                    title="Mark as read"
                    className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="py-20 flex flex-col items-center text-center text-slate-400">
              <Bell className="w-9 h-9 mb-3 opacity-30" />
              <p className="text-sm font-medium">No notifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── General Notifications ───────────────────────────────────────────────────
type TabType = 'All' | 'Critical' | 'Warning' | 'Info';

function GeneralNotifications() {
  const [notifications, setNotifications] = useState<GeneralNotif[]>(GENERAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<TabType>('All');

  const handleMarkAsRead = (id: string) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  const handleMarkAllAsRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const countFor = (cat: TabType) => notifications.filter(n => n.category === cat && !n.isRead).length;

  const filtered = notifications.filter(n => activeTab === 'All' || n.category === activeTab);

  const catStyles: Record<string, { border: string; badgeCls: string; icon: React.ReactNode }> = {
    Critical: {
      border: 'border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/10',
      badgeCls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
      icon: <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />,
    },
    Warning: {
      border: 'border-yellow-200 dark:border-yellow-900/50 bg-yellow-50/30 dark:bg-yellow-900/10',
      badgeCls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-500',
      icon: <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />,
    },
    Info: {
      border: 'border-blue-200 dark:border-blue-800/50',
      badgeCls: 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
      icon: <Bell className="w-4 h-4 text-blue-500 flex-shrink-0" />,
    },
  };

  return (
    <div className="min-h-full py-8 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{unreadCount} unread notifications</p>
          </div>
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 disabled:opacity-40 transition-colors mt-1"
          >
            Mark all read
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl w-fit">
          {(['All', 'Critical', 'Warning', 'Info'] as TabType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab}
              {tab !== 'All' && (
                <span className="font-medium opacity-60">{countFor(tab)}</span>
              )}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {filtered.map(item => {
            const style = catStyles[item.category] || catStyles.Info;
            const readCls = item.isRead ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-70' : style.border;

            return (
              <div key={item.id} className={`relative p-5 rounded-xl border transition-all ${readCls}`}>
                {/* Unread dot */}
                {!item.isRead && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500" />
                )}

                {/* Row 1: icon + category badge + time */}
                <div className="flex items-center gap-2 mb-2">
                  {style.icon}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${style.badgeCls}`}>
                    {item.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 ml-auto pr-6">{item.time}</span>
                </div>

                {/* Row 2: text */}
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed ml-6 mb-2">
                  {item.text}
                </p>

                {/* Row 3: actions */}
                <div className="flex items-center gap-4 ml-6">
                  {item.reqId && (
                    <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
                      View {item.reqId}
                    </button>
                  )}
                  {!item.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(item.id)}
                      className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-16 text-center text-sm text-slate-500 dark:text-slate-400">
              No {activeTab !== 'All' ? activeTab.toLowerCase() : ''} notifications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Root export (role-aware) ──────────────────────────────────────────────
export default function Notifications() {
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : {};
  return currentUser.role === 'Ambulance Operator'
    ? <OperatorNotifications />
    : <GeneralNotifications />;
}
