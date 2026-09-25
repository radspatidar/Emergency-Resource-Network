import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/client';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const processLogin = (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', 'mock-token');
    navigate('/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await login({ email, password });
      processLogin(data.user);
    } catch (err: any) {
      // Client-side fallback if backend server/DB is unavailable
      if (email === 'coordinator@healthresq.in' && password === 'coordinator123') {
        processLogin({ id: 'usr-coord', name: 'EMS Coordinator', role: 'Emergency Coordinator', email });
      } else if (email === 'hospital@healthresq.in' && password === 'hospital123') {
        processLogin({ id: 'usr-hospital', name: 'Dr. Priya Sharma', role: 'Hospital Admin', email, hospital: 'City Care Hospital' });
      } else if (email === 'admin@healthresq.in' && password === 'admin123') {
        processLogin({ id: 'usr-admin', name: 'System Administrator', role: 'System Admin', email });
      } else if (email === 'operator@healthresq.in' && password === 'operator123') {
        processLogin({ id: 'usr-oper', name: 'Rahul Sharma', role: 'Ambulance Operator', email, ambulance: 'A001' });
      } else {
        setError(err?.response?.data?.message || 'Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoRole = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-4 font-sans selection:bg-brand-500 selection:text-white relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl relative z-10 overflow-hidden">
        
        {/* Top subtle highlight */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-30"></div>

        <div className="p-8 sm:p-10 flex flex-col items-center">
          
          {/* Logo */}
          <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand-500/20">
            <Shield className="w-7 h-7 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-1">HealthResQ</h1>
          <p className="text-xs text-slate-500 mb-4">Emergency Resource Coordination System</p>
          
          {/* Quick Demo Role Selector */}
          <div className="w-full space-y-1.5 mb-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Quick Role Login</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoRole('admin@healthresq.in', 'admin123')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200 transition-colors truncate"
              >
                System Admin
              </button>
              <button
                type="button"
                onClick={() => setDemoRole('hospital@healthresq.in', 'hospital123')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200 transition-colors truncate"
              >
                Hospital Admin
              </button>
              <button
                type="button"
                onClick={() => setDemoRole('coordinator@healthresq.in', 'coordinator123')}
                className="py-1.5 px-2 bg-brand-50 hover:bg-brand-100 text-brand-700 text-[10px] font-bold rounded-lg border border-brand-200 transition-colors truncate"
              >
                EMS Coord
              </button>
              <button
                type="button"
                onClick={() => setDemoRole('operator@healthresq.in', 'operator123')}
                className="py-1.5 px-2 bg-brand-50 hover:bg-brand-100 text-brand-700 text-[10px] font-bold rounded-lg border border-brand-200 transition-colors truncate"
              >
                Amb. Operator
              </button>
            </div>
          </div>

          {/* Form */}
          <form className="w-full space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coordinator@healthresq.in"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>

            <div className="space-y-1.5 text-left relative">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-4 pr-12 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 text-center">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-brand-600/20 mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Security Message */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-slate-500">
            <Lock className="w-3 h-3 text-amber-500" />
            <p className="text-[10px] text-center leading-relaxed">
              Authorized access only. All activity is monitored and logged.
            </p>
          </div>
          
        </div>
      </div>

      {/* Footer text */}
      <p className="mt-6 text-[11px] text-slate-500 font-medium z-10">
        Real-Time Healthcare Emergency Resource Coordination System v2.41
      </p>
    </div>
  );
}
