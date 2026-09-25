import React, { useState } from 'react';
import { Search, Plus, Eye, Edit2, Trash2, ChevronDown, ChevronLeft, ChevronRight, X, Filter } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, deleteUser } from '../api/client';
import clsx from 'clsx';

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  hospital?: string;
  createdAt: string;
};

type FormData = {
  name: string; email: string; phone: string; role: string;
  status: string; hospital: string; password: string;
};

const ROLES = ['All Roles', 'System Admin', 'Hospital Admin', 'Emergency Coordinator', 'Ambulance Operator'];
const STATUSES = ['All Status', 'Active', 'Inactive'];
const ITEMS_PER_PAGE = 8;

const getRoleColor = (role: string) => {
  switch (role) {
    case 'System Admin': return 'bg-brand-500/10 text-brand-500 border-brand-500/20';
    case 'Hospital Admin': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'Emergency Coordinator': return 'bg-red-500/10 text-red-500 border-red-500/20';
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

const emptyForm: FormData = { name: '', email: '', phone: '', role: 'Hospital Admin', status: 'Active', hospital: '', password: '' };

export default function UsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editForm, setEditForm] = useState<FormData>(emptyForm);
  const [apiError, setApiError] = useState('');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users', search],
    queryFn: () => getUsers(search || undefined),
  });

  const filtered = users.filter((u: User) => {
    if (roleFilter !== 'All Roles' && u.role !== roleFilter) return false;
    if (statusFilter !== 'All Status' && u.status !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const createMutation = useMutation({
    mutationFn: (data: any) => createUser(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setIsCreateOpen(false); setForm(emptyForm); setApiError(''); },
    onError: (err: any) => setApiError(err?.response?.data?.error || 'Failed to create user'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateUser(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setEditUser(null); setApiError(''); },
    onError: (err: any) => setApiError(err?.response?.data?.error || 'Failed to update user'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setDeleteTarget(null); },
  });

  const handleEdit = (user: User) => {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email, phone: user.phone || '', role: user.role, status: user.status, hospital: user.hospital || '', password: '' });
    setApiError('');
  };

  return (
    <div className="space-y-6 flex flex-col h-full relative">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Users</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} users found</p>
        </div>
        <button
          onClick={() => { setIsCreateOpen(true); setForm(emptyForm); setApiError(''); }}
          className="flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />Add User
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-slate-700/80 rounded-lg bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            placeholder="Search users by name, email, or role..."
          />
        </div>
        <div className="flex gap-3">
          <div className="flex items-center text-gray-400 px-2"><Filter className="w-4 h-4" /></div>
          <div className="relative">
            <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              className="block w-48 pl-3 pr-10 py-2 border border-gray-200 dark:border-slate-700/80 rounded-lg bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 appearance-none cursor-pointer">
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500"><ChevronDown className="w-4 h-4" /></div>
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="block w-36 pl-3 pr-10 py-2 border border-gray-200 dark:border-slate-700/80 rounded-lg bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 appearance-none cursor-pointer">
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500"><ChevronDown className="w-4 h-4" /></div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-850 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
              <th className="p-4">Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Created</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
            {isLoading ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500 text-sm">Loading users...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500 text-sm">No users found.</td></tr>
            ) : (
              paginated.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-600/80 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">{getInitials(user.name)}</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={clsx('inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border', getRoleColor(user.role))}>{user.role}</span>
                  </td>
                  <td className="p-4">
                    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border',
                      user.status === 'Active' ? 'bg-status-success/10 text-status-success border-status-success/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20')}>
                      <span className={clsx('w-1.5 h-1.5 rounded-full mr-1.5', user.status === 'Active' ? 'bg-status-success' : 'bg-gray-500')}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-500">{user.phone || '—'}</td>
                  <td className="p-4 text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2 text-gray-400">
                      <button onClick={() => setViewUser(user)} className="p-1.5 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded transition-colors"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleEdit(user)} className="p-1.5 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteTarget(user)} className="p-1.5 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between bg-gray-50 dark:bg-slate-900/30">
            <span className="text-xs text-gray-500 font-medium">Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</span>
            <div className="flex space-x-1">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={clsx("w-8 h-8 flex items-center justify-center rounded font-bold text-xs transition-colors",
                    currentPage === p ? "bg-brand-600 text-white" : "text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700")}>
                  {p}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#131b2e] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700/80 overflow-hidden flex flex-col">
            <div className="flex justify-between items-start p-6 border-b border-gray-200 dark:border-slate-700/80">
              <div><h3 className="text-lg font-bold text-gray-900 dark:text-white">Create User</h3><p className="text-xs text-gray-500 mt-1">Add a new system user and assign their role.</p></div>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              {apiError && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-500">{apiError}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Dr. Priya Sharma" className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="user@healthresq.in" className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Phone Number</label>
                  <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500" />
                </div>
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Role <span className="text-red-500">*</span></label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full pl-3 pr-10 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 appearance-none">
                    {ROLES.slice(1).map(r => <option key={r}>{r}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-9 text-gray-500 pointer-events-none" />
                </div>
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full pl-3 pr-10 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 appearance-none">
                    <option>Active</option><option>Inactive</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-9 text-gray-500 pointer-events-none" />
                </div>
                {form.role === 'Hospital Admin' && (
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Associated Hospital</label>
                    <input type="text" value={form.hospital} onChange={e => setForm({ ...form, hospital: e.target.value })} placeholder="Hospital name" className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500" />
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Password <span className="text-red-500">*</span></label>
                  <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min. 8 characters" className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-slate-700/80 bg-gray-50 dark:bg-slate-900/30 flex justify-end space-x-3">
              <button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg border border-gray-300 dark:border-slate-700 transition-colors">Cancel</button>
              <button
                onClick={() => createMutation.mutate(form)}
                disabled={createMutation.isPending}
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors disabled:opacity-70"
              >
                {createMutation.isPending ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#131b2e] w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700/80 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700/80">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">User Profile</h3>
              <button onClick={() => setViewUser(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xl">{getInitials(viewUser.name)}</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{viewUser.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{viewUser.email}</p>
                  <div className="flex gap-2">
                    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border', viewUser.status === 'Active' ? 'bg-status-success/10 text-status-success border-status-success/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20')}>
                      <span className={clsx('w-1.5 h-1.5 rounded-full mr-1.5', viewUser.status === 'Active' ? 'bg-status-success' : 'bg-gray-500')}></span>{viewUser.status}
                    </span>
                    <span className={clsx('inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border', getRoleColor(viewUser.role))}>{viewUser.role}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-slate-800/60 p-4 rounded-xl border border-gray-200 dark:border-slate-700/50">
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{viewUser.phone || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800/60 p-4 rounded-xl border border-gray-200 dark:border-slate-700/50">
                  <p className="text-xs text-gray-500 mb-1">Hospital</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{viewUser.hospital || 'N/A'}</p>
                </div>
                <div className="col-span-2 bg-gray-50 dark:bg-slate-800/60 p-4 rounded-xl border border-gray-200 dark:border-slate-700/50">
                  <p className="text-xs text-gray-500 mb-1">Created</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{new Date(viewUser.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#131b2e] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700/80 overflow-hidden flex flex-col">
            <div className="flex justify-between items-start p-6 border-b border-gray-200 dark:border-slate-700/80">
              <div><h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit User</h3><p className="text-xs text-gray-500 mt-1">Editing {editUser.name}</p></div>
              <button onClick={() => setEditUser(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              {apiError && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-500">{apiError}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Phone Number</label>
                  <input type="text" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500" />
                </div>
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Role</label>
                  <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} className="w-full pl-3 pr-10 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 appearance-none">
                    {ROLES.slice(1).map(r => <option key={r}>{r}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-9 text-gray-500 pointer-events-none" />
                </div>
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Status</label>
                  <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="w-full pl-3 pr-10 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 appearance-none">
                    <option>Active</option><option>Inactive</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-9 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-slate-700/80 bg-gray-50 dark:bg-slate-900/30 flex justify-end space-x-3">
              <button onClick={() => setEditUser(null)} className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg border border-gray-300 dark:border-slate-700 transition-colors">Cancel</button>
              <button
                onClick={() => updateMutation.mutate({ id: editUser.id, data: editForm })}
                disabled={updateMutation.isPending}
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors disabled:opacity-70"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#131b2e] w-full max-w-sm rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700/80 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete User</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-white">{deleteTarget.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg border border-gray-300 dark:border-slate-700 transition-colors">Cancel</button>
              <button
                onClick={() => deleteMutation.mutate(deleteTarget.id)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors disabled:opacity-70"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
