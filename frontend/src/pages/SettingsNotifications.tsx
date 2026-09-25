import React, { useState } from 'react';
import { Save } from 'lucide-react';
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

export default function SettingsNotifications() {
  const [toggles, setToggles] = useState({
    emergency: true,
    resources: true,
    system: true,
    userActivity: false,
    emailAlerts: true
  });

  const toggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Settings</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Manage your profile, security, and preferences</p>
      </div>

      <div className="bg-white dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-800">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Notification Preferences</h4>
        </div>
        <div className="p-6 space-y-8">
          
          <div className="space-y-4">
            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Alert Types</h5>
            
            <div className="divide-y divide-gray-100 dark:divide-slate-800/60">
              <div className="py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Emergency request alerts (Critical / High priority)</p>
                </div>
                <Toggle checked={toggles.emergency} onChange={() => toggle('emergency')} />
              </div>
              
              <div className="py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Resource availability alerts (hospitals, ambulances)</p>
                </div>
                <Toggle checked={toggles.resources} onChange={() => toggle('resources')} />
              </div>
              
              <div className="py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">System alerts and maintenance notices</p>
                </div>
                <Toggle checked={toggles.system} onChange={() => toggle('system')} />
              </div>
              
              <div className="py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">User activity notifications (logins, changes)</p>
                </div>
                <Toggle checked={toggles.userActivity} onChange={() => toggle('userActivity')} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Delivery</h5>
            
            <div className="divide-y divide-gray-100 dark:divide-slate-800/60">
              <div className="py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Email notifications for critical alerts</p>
                </div>
                <Toggle checked={toggles.emailAlerts} onChange={() => toggle('emailAlerts')} />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button className="flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors">
              <Save className="w-4 h-4 mr-2" />
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
