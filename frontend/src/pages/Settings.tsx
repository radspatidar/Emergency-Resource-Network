import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { updateProfile } from '../api/client';

export default function Settings() {
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : { id: '', name: '', email: '', role: '', phone: '' };

  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const updateMutation = useMutation({
    mutationFn: () => updateProfile({ id: currentUser.id, name, email, phone }),
    onSuccess: (data) => {
      localStorage.setItem('user', JSON.stringify({ ...currentUser, name: data.name, email: data.email, phone: data.phone }));
      setSuccess('Profile updated successfully!');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err: any) => {
      setError(err?.response?.data?.error || 'Failed to update profile');
      setSuccess('');
    }
  });

  const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Settings</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Manage your profile, security, and preferences</p>
      </div>

      <div className="bg-white dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-800">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Profile Information</h4>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xl">
              {initials || 'SA'}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{name}</p>
              <p className="text-xs text-gray-500">{currentUser.role}</p>
            </div>
          </div>

          {success && <div className="px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-600 dark:text-green-400">{success}</div>}
          {error && <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-500">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Full Name <span className="text-red-500">*</span></label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Email Address <span className="text-red-500">*</span></label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Phone Number</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Role</label>
              <input type="text" value={currentUser.role} disabled
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              className="flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-70"
            >
              <User className="w-4 h-4 mr-2" />
              {updateMutation.isPending ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
