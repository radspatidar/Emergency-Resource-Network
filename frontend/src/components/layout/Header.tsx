import React, { useState, useRef, useEffect } from 'react';
import { Search, Moon, Sun, Bell, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLocation, Link } from 'react-router-dom';
import clsx from 'clsx';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : { name: 'Emergency Coordinator', role: 'Emergency Coordinator' };
  const isCoordinator = currentUser.role === 'Emergency Coordinator' || currentUser.role === 'EMS Coordinator' || currentUser.role === 'Dispatch';
  const isOperator = currentUser.role === 'Ambulance Operator';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return isCoordinator ? 'Emergency Operations' : currentUser.role === 'Hospital Admin' ? 'Emergency Department' : 'Dashboard';
      case '/operator-dashboard': return 'Dashboard';
      case '/assigned-emergency': return 'Assigned Emergency';
      case '/active-trip': return 'Active Trip';
      case '/location': return 'Location';
      case '/trip-history': return 'Trip History';
      case '/emergency-requests': return 'Emergency Requests';
      case '/emergency-requests/new': return 'New Emergency';
      case '/resource-matching': return 'Resource Matching';
      case '/assignments': return 'Assignments';
      case '/monitoring': return 'Monitoring';
      case '/users': return 'Users';
      case '/hospitals': return 'Hospitals';
      case '/ambulances': return 'Ambulances';
      case '/resources': return 'Resources';
      case '/emergency-status': return 'Emergency Department';
      case '/activity': return 'Activity';
      case '/notifications': return 'Notifications';
      case '/settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  const getSubTitle = () => {
    switch (location.pathname) {
      case '/': return isCoordinator ? 'Coordinator / Dashboard' : currentUser.role === 'Hospital Admin' ? 'Hospital Operations > Emergency Status' : 'Overview / System Status';
      case '/emergency-requests': return 'Coordinator / Emergency Requests';
      case '/emergency-requests/new': return 'Coordinator / Emergency Requests / New';
      case '/resource-matching': return 'Coordinator / Resource Matching';
      case '/assignments': return 'Coordinator / Assignments';
      case '/monitoring': return 'Coordinator / Monitoring';
      case '/users': return 'Administration / Users';
      case '/hospitals': return 'Network / Facilities';
      case '/emergency-status': return 'Hospital Operations > Emergency Status';
      case '/activity': return isCoordinator ? 'Coordinator / Activity' : 'Hospital Operations > Activity';
      case '/settings': return 'Configuration / Settings';
      default: return 'Overview';
    }
  };

  const initials = currentUser.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'EC';

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-[#0b1120] border-b border-gray-200 dark:border-[#1e293b] sticky top-0 z-20 transition-colors duration-200">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{getPageTitle()}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{getSubTitle()}</p>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Hospital Indicator Pill (for Hospital Admin) */}
        {currentUser.role === 'Hospital Admin' && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>City Care Hospital</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 font-mono">HOS-001</span>
          </div>
        )}

        {/* Ambulance Status Pill (for Ambulance Operator) */}
        {isOperator && (
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <svg className="w-4 h-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            <div>
              <p className="text-[10px] leading-none text-slate-500 font-bold uppercase tracking-wider">Ambulance</p>
              <p className="font-bold text-slate-900 dark:text-white font-mono">A001</p>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              AVAILABLE
            </span>
          </div>
        )}

        {/* Search */}
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-48 lg:w-60 pl-9 pr-3 py-1.5 border border-transparent rounded-lg leading-5 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-slate-700 focus:border-brand-500 text-xs transition-colors"
            placeholder="Search..."
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          title="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold ring-2 ring-white dark:ring-[#0b1120]">3</span>
          </button>
          
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#131b2e] border border-gray-200 dark:border-slate-700/80 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700/80 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
                <span className="text-xs text-brand-600 dark:text-brand-500 hover:text-brand-700 dark:hover:text-brand-400 cursor-pointer font-medium">Mark all read</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors relative">
                   <span className="absolute top-3 right-4 w-1.5 h-1.5 rounded-full bg-status-critical"></span>
                   <p className="text-sm text-gray-900 dark:text-white font-medium pr-4">Multiple emergency requests pending — 2 requests awaiting assignment.</p>
                   <p className="text-xs text-gray-500 mt-1 font-medium">11:02 AM</p>
                </div>
                <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors relative">
                   <span className="absolute top-3 right-4 w-1.5 h-1.5 rounded-full bg-status-warning"></span>
                   <p className="text-sm text-gray-900 dark:text-white font-medium pr-4">Hospital Lifeline Trauma Center is now FULL — ICU and beds at 0.</p>
                   <p className="text-xs text-gray-500 mt-1 font-medium">10:50 AM</p>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-slate-700/80 p-2 bg-gray-50 dark:bg-slate-900/50">
                <Link to="/notifications" onClick={() => setIsNotifOpen(false)} className="block w-full text-center py-1 text-sm text-brand-600 dark:text-brand-500 hover:text-brand-700 dark:hover:text-brand-400 font-semibold transition-colors">
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative border-l border-gray-200 dark:border-gray-800 pl-2" ref={profileRef}>
          <button 
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{currentUser.role}</p>
            </div>
            <ChevronDown className={clsx("w-3.5 h-3.5 text-gray-400 transition-transform", isProfileOpen && "rotate-180")} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#131b2e] border border-gray-200 dark:border-slate-700/80 rounded-xl shadow-xl py-2 z-50">
              <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="block w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors font-medium">
                Profile Settings
              </Link>
              <div className="h-px bg-gray-200 dark:bg-slate-700/80 my-1"></div>
              <div className="px-4 py-2">
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">Role</p>
                <p className="text-xs font-semibold text-brand-600 dark:text-brand-500">{currentUser.role}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
