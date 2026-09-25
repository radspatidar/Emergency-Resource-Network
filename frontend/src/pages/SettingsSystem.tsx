import React from 'react';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button 
      onClick={onChange}
      className={clsx(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900",
        checked ? "bg-brand-500" : "bg-gray-300 dark:bg-slate-600"
      )}
    >
      <span
        className={clsx(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}

export default function SettingsSystem() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Settings</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Manage your profile, security, and preferences</p>
      </div>

      <div className="bg-white dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-800">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">System Preferences</h4>
        </div>
        <div className="p-6 space-y-8">
          
          <div className="space-y-4">
            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Appearance</h5>
            
            <div className="py-4 border-b border-gray-100 dark:border-slate-800/60 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-xs text-gray-500 mt-0.5">Use dark command-center theme</p>
              </div>
              <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">System Information</h5>
            
            <div className="divide-y divide-gray-100 dark:divide-slate-800/60">
              <div className="py-4 flex justify-between">
                <span className="text-sm text-gray-500 font-medium">Platform</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">HealthResQ Emergency Coordination Platform</span>
              </div>
              <div className="py-4 flex justify-between">
                <span className="text-sm text-gray-500 font-medium">Module</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">System Admin — Module 1</span>
              </div>
              <div className="py-4 flex justify-between">
                <span className="text-sm text-gray-500 font-medium">Version</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">2.4.1</span>
              </div>
              <div className="py-4 flex justify-between">
                <span className="text-sm text-gray-500 font-medium">Environment</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">Production</span>
              </div>
              <div className="py-4 flex justify-between">
                <span className="text-sm text-gray-500 font-medium">Data Region</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">India — Central</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
