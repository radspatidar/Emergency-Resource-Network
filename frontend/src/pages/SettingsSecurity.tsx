import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Monitor, Laptop } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { updatePassword } from '../api/client';

export default function SettingsSecurity() {
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : { id: '' };

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const passwordMutation = useMutation({
    mutationFn: () => updatePassword({ id: currentUser.id, currentPassword, newPassword }),
    onSuccess: () => {
      setSuccess('Password updated successfully!');
      setError('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 4000);
    },
    onError: (err: any) => {
      setError(err?.response?.data?.error || 'Failed to update password');
      setSuccess('');
    }
  });

  const handleSubmit = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }
    setError('');
    passwordMutation.mutate();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Settings</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Manage your profile, security, and preferences</p>
      </div>

      <div className="bg-white dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-800">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Change Password</h4>
        </div>
        <div className="p-6 space-y-6 border-b border-gray-200 dark:border-slate-800">
          {success && <div className="px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-600 dark:text-green-400">{success}</div>}
          {error && <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-500">{error}</div>}
          <div className="space-y-4 max-w-xl">
            <div className="space-y-1.5 relative">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Current Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 pr-10 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">New Password <span className="text-red-500">*</span></label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Confirm New Password <span className="text-red-500">*</span></label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSubmit}
                disabled={passwordMutation.isPending}
                className="flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-70"
              >
                <Shield className="w-4 h-4 mr-2" />
                {passwordMutation.isPending ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Active Sessions</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700/50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-200 dark:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-300">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Chrome on Windows 11</p>
                  <p className="text-xs text-gray-500">Indore, India • Active now</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-status-success text-sm font-semibold">
                <div className="w-1.5 h-1.5 rounded-full bg-status-success"></div>
                Current
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700/50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-200 dark:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-300">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Safari on MacBook Pro</p>
                  <p className="text-xs text-gray-500">Indore, India • Yesterday at 6:30 PM</p>
                </div>
              </div>
              <button className="text-status-critical hover:text-red-600 text-sm font-semibold transition-colors">Revoke</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
