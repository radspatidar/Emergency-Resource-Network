import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Ambulance, 
  Activity, 
  Bell, 
  Settings, 
  LogOut,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Database,
  AlertTriangle,
  Search,
  FileCheck,
  Radio,
  MapPin
} from 'lucide-react';
import clsx from 'clsx';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : { name: 'Emergency Coordinator', role: 'Emergency Coordinator' };
  const initials = currentUser.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'EC';

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const systemAdminNav = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Hospitals', path: '/hospitals', icon: Building2 },
    { name: 'Ambulances', path: '/ambulances', icon: Ambulance },
    { name: 'System Activity', path: '/activity', icon: Activity },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: 3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const hospitalAdminNav = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Resources', path: '/resources', icon: Database },
    { name: 'Emergency Status', path: '/emergency-status', icon: AlertTriangle },
    { name: 'Activity', path: '/activity', icon: Activity },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: 3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const coordinatorNav = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Emergency Requests', path: '/emergency-requests', icon: AlertTriangle, badge: 5 },
    { name: 'Resource Matching', path: '/resource-matching', icon: Search },
    { name: 'Assignments', path: '/assignments', icon: FileCheck },
    { name: 'Monitoring', path: '/monitoring', icon: Radio },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: 4 },
    { name: 'Activity', path: '/activity', icon: Activity },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const operatorNav = [
    { name: 'Dashboard', path: '/operator-dashboard', icon: LayoutDashboard },
    { name: 'Assigned Emergency', path: '/assigned-emergency', icon: AlertTriangle },
    { name: 'Active Trip', path: '/active-trip', icon: Ambulance },
    { name: 'Location', path: '/location', icon: MapPin },
    { name: 'Trip History', path: '/trip-history', icon: FileCheck },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: 2 },
    { name: 'Activity', path: '/activity', icon: Activity },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isCoordinator = currentUser.role === 'Emergency Coordinator' || currentUser.role === 'EMS Coordinator' || currentUser.role === 'Dispatch';
  const isOperator = currentUser.role === 'Ambulance Operator';

  const navItems = isOperator
    ? operatorNav
    : isCoordinator
    ? coordinatorNav
    : currentUser.role === 'Hospital Admin'
    ? hospitalAdminNav
    : systemAdminNav;

  return (
    <aside className={clsx(
      "flex-shrink-0 flex flex-col bg-white dark:bg-[#0f172a] border-r border-gray-200 dark:border-[#1e293b] h-screen sticky top-0 transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Logo Area */}
      <div className={clsx("h-16 flex items-center px-4 border-b border-gray-200 dark:border-[#1e293b] relative", isCollapsed ? "justify-center" : "")}>
        <div className="flex items-center flex-1 overflow-hidden">
          <ShieldAlert className="w-8 h-8 text-brand-600 dark:text-brand-500 flex-shrink-0" />
          {!isCollapsed && (
            <div className="ml-3 truncate">
              <h1 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                {isOperator ? 'ERC System' : 'HealthResQ'}
              </h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                {isOperator ? 'Operator Module' : isCoordinator ? 'Emergency Coord.' : 'Admin Portal'}
              </p>
            </div>
          )}
        </div>
        
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={clsx(
            "absolute top-5 flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-slate-700 transition-colors z-10",
            isCollapsed ? "left-1/2 -translate-x-1/2 top-[72px]" : "right-3"
          )}
          style={isCollapsed ? { position: 'fixed', left: '28px', top: '72px' } : {}}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3 mt-4">
        {!isCollapsed && (
          <p className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider">Main Menu</p>
        )}
        <nav className="space-y-2">
          {navItems.map((item) => {
            if (item.name === 'Settings') {
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    title={isCollapsed ? item.name : undefined}
                    className={clsx(
                      'w-full flex items-center text-sm font-medium rounded-lg transition-colors group relative',
                      isCollapsed ? 'justify-center p-3' : 'justify-between px-3 py-2.5',
                      'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className={clsx('w-5 h-5', !isCollapsed && 'mr-3', 'opacity-70 group-hover:opacity-100')} />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown className={clsx('w-4 h-4 transition-transform text-gray-400', isSettingsOpen ? 'rotate-180' : '')} />
                    )}
                  </button>
                  {isSettingsOpen && !isCollapsed && (
                    <div className="pl-11 pr-3 space-y-1 mt-1">
                       <NavLink to="/settings" end className={({isActive}) => clsx('block py-2 px-3 text-sm rounded-lg font-medium transition-colors', isActive ? 'bg-brand-50 dark:bg-brand-600/10 text-brand-700 dark:text-brand-500' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800')}>Profile</NavLink>
                       <NavLink to="/settings/security" className={({isActive}) => clsx('block py-2 px-3 text-sm rounded-lg font-medium transition-colors', isActive ? 'bg-brand-50 dark:bg-brand-600/10 text-brand-700 dark:text-brand-500' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800')}>Security</NavLink>
                       <NavLink to="/settings/notifications" className={({isActive}) => clsx('block py-2 px-3 text-sm rounded-lg font-medium transition-colors', isActive ? 'bg-brand-50 dark:bg-brand-600/10 text-brand-700 dark:text-brand-500' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800')}>Notifications</NavLink>
                       <NavLink to="/settings/system" className={({isActive}) => clsx('block py-2 px-3 text-sm rounded-lg font-medium transition-colors', isActive ? 'bg-brand-50 dark:bg-brand-600/10 text-brand-700 dark:text-brand-500' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800')}>System</NavLink>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center text-sm font-medium rounded-lg transition-colors group relative',
                    isCollapsed ? 'justify-center p-3' : 'justify-between px-3 py-2.5',
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-600/10 text-brand-700 dark:text-brand-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  )
                }
              >
                <div className="flex items-center">
                  <item.icon className={clsx('w-5 h-5', !isCollapsed && 'mr-3', 'opacity-70 group-hover:opacity-100')} />
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
                {item.badge && (
                  <span className={clsx(
                    "flex items-center justify-center font-bold text-white bg-red-500 rounded-full",
                    isCollapsed ? "absolute top-1 right-1 w-4 h-4 text-[9px]" : "px-2 py-0.5 text-xs leading-none"
                  )}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-[#1e293b]">
        <Link to="/settings" className={clsx("flex items-center mb-4 hover:opacity-80 transition-opacity", isCollapsed && "justify-center")}>
          <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex-shrink-0 flex items-center justify-center font-bold text-sm">
            {initials}
          </div>
          {!isCollapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.role}</p>
            </div>
          )}
        </Link>
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : undefined}
          className={clsx(
            "flex items-center w-full py-2 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-red-500 dark:hover:text-red-400 transition-colors",
            isCollapsed ? "justify-center px-0" : "px-3"
          )}
        >
          <LogOut className={clsx("w-5 h-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
