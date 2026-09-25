import React, { useState } from 'react';
import { Search, Plus, Eye, Edit2, Trash2, X, Filter, ChevronDown, Phone } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHospitals, createHospital, updateHospital, deleteHospital } from '../api/client';
import clsx from 'clsx';

type Hospital = {
  id: string;
  name: string;
  city: string;
  type: string;
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  availableIcu: number;
  status: string;
  contact?: string;
  createdAt: string;
};

type HospitalForm = {
  name: string; city: string; type: string;
  totalBeds: string; availableBeds: string;
  icuBeds: string; availableIcu: string;
  status: string; contact: string;
};

const emptyForm: HospitalForm = {
  name: '', city: '', type: 'General Hospital',
  totalBeds: '', availableBeds: '', icuBeds: '', availableIcu: '',
  status: 'Active', contact: ''
};

const STATUSES = ['All Status', 'Active', 'Critical', 'At Capacity'];
const TYPES = ['General Hospital', 'Trauma Center', 'Specialty Hospital', 'Pediatric Hospital', 'Medical College'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-status-success/10 text-status-success border-status-success/20';
    case 'Critical': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    case 'At Capacity': return 'bg-red-500/10 text-red-500 border-red-500/20';
    default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};

const FormFields = ({ data, onChange }: { data: HospitalForm; onChange: (d: HospitalForm) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    <div className="md:col-span-2 space-y-1.5">
      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Hospital Name <span className="text-red-500">*</span></label>
      <input type="text" value={data.name} onChange={e => onChange({ ...data, name: e.target.value })} placeholder="e.g. City Care Hospital" className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500" />
    </div>
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">City <span className="text-red-500">*</span></label>
      <input type="text" value={data.city} onChange={e => onChange({ ...data, city: e.target.value })} placeholder="e.g. Indore" className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500" />
    </div>
    <div className="space-y-1.5 relative">
      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Type</label>
      <select value={data.type} onChange={e => onChange({ ...data, type: e.target.value })} className="w-full pl-3 pr-10 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 appearance-none">
        {TYPES.map(t => <option key={t}>{t}</option>)}
      </select>
      <ChevronDown className="w-4 h-4 absolute right-3 top-9 text-gray-500 pointer-events-none" />
    </div>
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Total Beds</label>
      <input type="number" value={data.totalBeds} onChange={e => onChange({ ...data, totalBeds: e.target.value })} placeholder="0" className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500" />
    </div>
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Available Beds</label>
      <input type="number" value={data.availableBeds} onChange={e => onChange({ ...data, availableBeds: e.target.value })} placeholder="0" className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500" />
    </div>
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">ICU Beds</label>
      <input type="number" value={data.icuBeds} onChange={e => onChange({ ...data, icuBeds: e.target.value })} placeholder="0" className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500" />
    </div>
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Available ICU</label>
      <input type="number" value={data.availableIcu} onChange={e => onChange({ ...data, availableIcu: e.target.value })} placeholder="0" className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500" />
    </div>
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Contact</label>
      <input type="text" value={data.contact} onChange={e => onChange({ ...data, contact: e.target.value })} placeholder="+91 731 400 1000" className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500" />
    </div>
    <div className="space-y-1.5 relative">
      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Status</label>
      <select value={data.status} onChange={e => onChange({ ...data, status: e.target.value })} className="w-full pl-3 pr-10 py-2.5 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 appearance-none">
        {STATUSES.slice(1).map(s => <option key={s}>{s}</option>)}
      </select>
      <ChevronDown className="w-4 h-4 absolute right-3 top-9 text-gray-500 pointer-events-none" />
    </div>
  </div>
);

export default function HospitalsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [viewHospital, setViewHospital] = useState<Hospital | null>(null);
  const [editHospital, setEditHospital] = useState<Hospital | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Hospital | null>(null);
  const [form, setForm] = useState<HospitalForm>(emptyForm);
  const [editForm, setEditForm] = useState<HospitalForm>(emptyForm);
  const [apiError, setApiError] = useState('');

  const { data: hospitals = [], isLoading } = useQuery({
    queryKey: ['hospitals', search],
    queryFn: () => getHospitals(search || undefined),
  });

  const filtered = hospitals.filter((h: Hospital) => {
    if (statusFilter !== 'All Status' && h.status !== statusFilter) return false;
    return true;
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => createHospital(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hospitals'] }); setIsRegisterOpen(false); setForm(emptyForm); setApiError(''); },
    onError: (err: any) => setApiError(err?.response?.data?.error || 'Failed to register hospital'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateHospital(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hospitals'] }); setEditHospital(null); setApiError(''); },
    onError: (err: any) => setApiError(err?.response?.data?.error || 'Failed to update hospital'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteHospital(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['hospitals'] }); setDeleteTarget(null); },
  });

  const handleEdit = (h: Hospital) => {
    setEditHospital(h);
    setEditForm({
      name: h.name, city: h.city, type: h.type,
      totalBeds: String(h.totalBeds), availableBeds: String(h.availableBeds),
      icuBeds: String(h.icuBeds), availableIcu: String(h.availableIcu),
      status: h.status, contact: h.contact || ''
    });
    setApiError('');
  };

  const numericFields = (f: HospitalForm) => ({
    ...f,
    totalBeds: Number(f.totalBeds),
    availableBeds: Number(f.availableBeds),
    icuBeds: Number(f.icuBeds),
    availableIcu: Number(f.availableIcu),
  });

  return (
    <div className="space-y-6 flex flex-col h-full relative">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hospitals</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} hospitals registered</p>
        </div>
        <button onClick={() => { setIsRegisterOpen(true); setForm(emptyForm); setApiError(''); }}
          className="flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-lg transition-colors">
          <Plus className="w-4 h-4 mr-2" />Register Hospital
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-4 w-4 text-gray-500" /></div>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-slate-700/80 rounded-lg bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            placeholder="Search by name, city, type..." />
        </div>
        <div className="flex gap-3">
          <div className="flex items-center text-gray-400 px-2"><Filter className="w-4 h-4" /></div>
          <div className="relative">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="block w-40 pl-3 pr-10 py-2 border border-gray-200 dark:border-slate-700/80 rounded-lg bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 appearance-none cursor-pointer">
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
              <th className="p-4">Hospital</th>
              <th className="p-4">Type</th>
              <th className="p-4">City</th>
              <th className="p-4">Beds</th>
              <th className="p-4">ICU</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
            {isLoading ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-500 text-sm">Loading hospitals...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-500 text-sm">No hospitals found.</td></tr>
            ) : (
              filtered.map((h: Hospital) => (
                <tr key={h.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{h.name}</p>
                    {h.contact && <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" />{h.contact}</p>}
                  </td>
                  <td className="p-4 text-xs text-gray-600 dark:text-gray-400">{h.type}</td>
                  <td className="p-4 text-xs text-gray-600 dark:text-gray-400">{h.city}</td>
                  <td className="p-4">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{h.availableBeds}</span>
                    <span className="text-xs text-gray-500">/{h.totalBeds}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{h.availableIcu}</span>
                    <span className="text-xs text-gray-500">/{h.icuBeds}</span>
                  </td>
                  <td className="p-4">
                    <span className={clsx('inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border', getStatusColor(h.status))}>
                      <span className={clsx('w-1.5 h-1.5 rounded-full mr-1.5',
                        h.status === 'Active' ? 'bg-status-success' : h.status === 'Critical' ? 'bg-orange-500' : 'bg-red-500'
                      )}></span>
                      {h.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-gray-400">
                      <button onClick={() => setViewHospital(h)} className="p-1.5 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded transition-colors"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleEdit(h)} className="p-1.5 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteTarget(h)} className="p-1.5 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* REGISTER MODAL */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#131b2e] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700/80 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-start p-6 border-b border-gray-200 dark:border-slate-700/80 flex-shrink-0">
              <div><h3 className="text-lg font-bold text-gray-900 dark:text-white">Register Hospital</h3><p className="text-xs text-gray-500 mt-1">Add a new hospital to the network.</p></div>
              <button onClick={() => setIsRegisterOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              {apiError && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-500">{apiError}</div>}
              <FormFields data={form} onChange={setForm} />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-slate-700/80 bg-gray-50 dark:bg-slate-900/30 flex justify-end gap-3 flex-shrink-0">
              <button onClick={() => setIsRegisterOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg border border-gray-300 dark:border-slate-700 transition-colors">Cancel</button>
              <button onClick={() => createMutation.mutate(numericFields(form))} disabled={createMutation.isPending}
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors disabled:opacity-70">
                {createMutation.isPending ? 'Registering...' : 'Register Hospital'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#131b2e] w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700/80 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700/80">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Hospital Profile</h3>
              <button onClick={() => setViewHospital(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{viewHospital.name}</h4>
                  <p className="text-sm text-gray-500">{viewHospital.type} • {viewHospital.city}</p>
                </div>
                <span className={clsx('inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border', getStatusColor(viewHospital.status))}>{viewHospital.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-slate-800/60 p-4 rounded-xl border border-gray-200 dark:border-slate-700/50">
                  <p className="text-xs text-gray-500 mb-1">Available Beds</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{viewHospital.availableBeds}<span className="text-sm text-gray-500">/{viewHospital.totalBeds}</span></p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800/60 p-4 rounded-xl border border-gray-200 dark:border-slate-700/50">
                  <p className="text-xs text-gray-500 mb-1">Available ICU</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{viewHospital.availableIcu}<span className="text-sm text-gray-500">/{viewHospital.icuBeds}</span></p>
                </div>
                <div className="col-span-2 bg-gray-50 dark:bg-slate-800/60 p-4 rounded-xl border border-gray-200 dark:border-slate-700/50">
                  <p className="text-xs text-gray-500 mb-1">Contact</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{viewHospital.contact || 'N/A'}</p>
                </div>
                <div className="col-span-2 bg-gray-50 dark:bg-slate-800/60 p-4 rounded-xl border border-gray-200 dark:border-slate-700/50">
                  <p className="text-xs text-gray-500 mb-1">Registered</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{new Date(viewHospital.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#131b2e] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700/80 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-start p-6 border-b border-gray-200 dark:border-slate-700/80 flex-shrink-0">
              <div><h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Hospital</h3><p className="text-xs text-gray-500 mt-1">Editing {editHospital.name}</p></div>
              <button onClick={() => setEditHospital(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              {apiError && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-500">{apiError}</div>}
              <FormFields data={editForm} onChange={setEditForm} />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-slate-700/80 bg-gray-50 dark:bg-slate-900/30 flex justify-end gap-3 flex-shrink-0">
              <button onClick={() => setEditHospital(null)} className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg border border-gray-300 dark:border-slate-700 transition-colors">Cancel</button>
              <button onClick={() => updateMutation.mutate({ id: editHospital.id, data: numericFields(editForm) })} disabled={updateMutation.isPending}
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors disabled:opacity-70">
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#131b2e] w-full max-w-sm rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700/80 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Hospital</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to remove <span className="font-bold text-gray-900 dark:text-white">{deleteTarget.name}</span> from the network? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg border border-gray-300 dark:border-slate-700 transition-colors">Cancel</button>
              <button onClick={() => deleteMutation.mutate(deleteTarget.id)} disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors disabled:opacity-70">
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Hospital'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
