import React from 'react';
import { Building2, Ambulance, CheckCircle2, RefreshCw, AlertTriangle, Clock, MapPin } from 'lucide-react';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { getHospitals, getAmbulances, getEmergencies } from '../api/client';
import HospitalDashboard from './HospitalDashboard';
import CoordinatorDashboard from './CoordinatorDashboard';
import OperatorDashboard from './OperatorDashboard';

export default function Dashboard() {
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : { role: 'System Admin' };

  if (currentUser.role === 'Hospital Admin') {
    return <HospitalDashboard />;
  }

  if (currentUser.role === 'Emergency Coordinator' || currentUser.role === 'EMS Coordinator' || currentUser.role === 'Dispatch') {
    return <CoordinatorDashboard />;
  }

  if (currentUser.role === 'Ambulance Operator') {
    return <OperatorDashboard />;
  }

  const { data: rawHospitals = [] } = useQuery({ queryKey: ['hospitals'], queryFn: () => getHospitals(), refetchInterval: 5000 });
  const { data: rawAmbulances = [] } = useQuery({ queryKey: ['ambulances'], queryFn: () => getAmbulances(), refetchInterval: 5000 });
  const { data: rawEmergencies = [] } = useQuery({ queryKey: ['emergencies'], queryFn: () => getEmergencies(), refetchInterval: 5000 });

  const availableHospitals = rawHospitals.filter((h: any) => h.emergencyStatus === 'AVAILABLE').length;
  const outOfServiceAmbulances = rawAmbulances.filter((a: any) => a.status === 'OUT OF SERVICE').length;
  const availableAmbulances = rawAmbulances.filter((a: any) => a.status === 'AVAILABLE').length;
  const busyAmbulances = rawAmbulances.filter((a: any) => a.status === 'BUSY' || a.status === 'IN PROGRESS').length;
  const activeEmergencies = rawEmergencies.filter((e: any) => e.status !== 'COMPLETED').length;
  const pendingRequests = rawEmergencies.filter((e: any) => e.status === 'PENDING').length;
  const assignedRequests = rawEmergencies.filter((e: any) => e.status === 'ASSIGNED' || e.status === 'ACCEPTED').length;

  const kpis = [
    { title: 'Total Hospitals', value: String(rawHospitals.length), sub: `${availableHospitals} available`, icon: Building2, color: 'bg-brand-600', trend: 'up' },
    { title: 'Total Ambulances', value: String(rawAmbulances.length), sub: `${outOfServiceAmbulances} out of service`, icon: Ambulance, color: 'bg-slate-700', trend: 'up' },
    { title: 'Available Ambulances', value: String(availableAmbulances), sub: 'Ready for dispatch', icon: CheckCircle2, color: 'bg-status-success', trend: 'up' },
    { title: 'Busy Ambulances', value: String(busyAmbulances), sub: 'Currently assigned', icon: RefreshCw, color: 'bg-status-warning', trend: 'down' },
    { title: 'Active Emergencies', value: String(activeEmergencies), sub: 'Requires attention', icon: AlertTriangle, color: 'bg-status-critical', trend: 'up' },
    { title: 'Pending Requests', value: String(pendingRequests), sub: 'Awaiting assignment', icon: Clock, color: 'bg-orange-500', trend: 'up' },
    { title: 'Assigned Requests', value: String(assignedRequests), sub: 'Ambulance en route', icon: MapPin, color: 'bg-teal-500', trend: 'down' },
  ];

  const hospitals = rawHospitals.slice(0, 5).map((h: any) => ({
    id: h.id,
    name: h.name,
    location: h.city,
    status: h.emergencyStatus.charAt(0) + h.emergencyStatus.slice(1).toLowerCase(),
    beds: h.availableBeds,
    icu: h.availableIcu,
    updated: new Date(h.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));

  const alerts = [];
  if (pendingRequests > 0) {
    alerts.push({ id: 1, type: 'CRITICAL', msg: `${pendingRequests} emergency requests are currently Pending without ambulance assignment.`, time: 'Live' });
  }
  rawHospitals.forEach((h: any) => {
    if (h.availableIcu === 0) {
      alerts.push({ id: `h-${h.id}-icu`, type: 'WARNING', msg: `${h.name} ICU availability is critically low (0 beds remaining).`, time: 'Live' });
    }
    if (h.availableBeds < 5 && h.availableBeds > 0) {
      alerts.push({ id: `h-${h.id}-bed`, type: 'WARNING', msg: `${h.name} available beds dropped below threshold (${h.availableBeds} remaining).`, time: 'Live' });
    }
  });

  return (
    <div className="space-y-6">
      {/* Top Header Row for Dashboard (optional if already in Header, but we match the design) */}
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">System Overview</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Last updated: 11:05 AM</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-slate-850 rounded-xl p-4 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-brand-500/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center text-white', kpi.color)}>
                <kpi.icon className="w-4 h-4" />
              </div>
              <span className={clsx('text-[10px] font-bold', kpi.trend === 'up' ? 'text-status-success' : 'text-gray-400')}>
                {kpi.trend === 'up' ? '↗' : '—'}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{kpi.value}</p>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-1">{kpi.title}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5 truncate">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Hospital Network Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Hospital Network</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{rawHospitals.length} registered facilities</p>
            </div>
            <a href="/hospitals" className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline">View All →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                  <th className="p-4">Hospital</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Beds</th>
                  <th className="p-4 text-center">ICU</th>
                  <th className="p-4">Updated</th>
                  <th className="p-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
                {hospitals.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{h.name}</p>
                      <p className="text-xs text-gray-500">{h.id} • {h.location}</p>
                    </td>
                    <td className="p-4">
                      <span className={clsx(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border',
                        h.status === 'Available' ? 'bg-status-success/10 text-status-success border-status-success/20' : 
                        h.status === 'Busy' ? 'bg-status-warning/10 text-status-warning border-status-warning/20' : 
                        'bg-status-critical/10 text-status-critical border-status-critical/20'
                      )}>
                        <span className={clsx('w-1.5 h-1.5 rounded-full mr-1.5', 
                          h.status === 'Available' ? 'bg-status-success' : 
                          h.status === 'Busy' ? 'bg-status-warning' : 'bg-status-critical'
                        )}></span>
                        {h.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={clsx("text-sm font-bold", h.beds === 0 ? "text-status-critical" : h.beds < 20 ? "text-status-warning" : "text-status-success")}>{h.beds}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={clsx("text-sm font-bold", h.icu === 0 ? "text-status-critical" : h.icu < 5 ? "text-status-warning" : "text-status-success")}>{h.icu}</span>
                    </td>
                    <td className="p-4 text-xs text-gray-500 font-medium">{h.updated}</td>
                    <td className="p-4 text-right text-gray-400">
                      <button className="p-1 hover:text-brand-500 transition-colors"><Building2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col h-[400px]">
          <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">System Alerts</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">3 unread</p>
            </div>
            <a href="/notifications" className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline">View all</a>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto flex-1">
            {alerts.map(alert => (
              <div key={alert.id} className={clsx(
                "p-3 rounded-lg border text-sm flex gap-3",
                alert.type === 'CRITICAL' 
                  ? "bg-status-critical/5 border-status-critical/30 dark:border-status-critical/20" 
                  : "bg-status-warning/5 border-status-warning/30 dark:border-status-warning/20"
              )}>
                <AlertTriangle className={clsx("w-5 h-5 flex-shrink-0 mt-0.5", alert.type === 'CRITICAL' ? "text-status-critical" : "text-status-warning")} />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className={clsx("text-[10px] font-bold tracking-wider", alert.type === 'CRITICAL' ? "text-status-critical" : "text-status-warning")}>
                      {alert.type} <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-500 ml-1"></span>
                    </span>
                    <button className="text-[10px] font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Mark read</button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 text-xs leading-relaxed">{alert.msg}</p>
                  <p className="text-[10px] text-gray-500 mt-2 font-medium">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
