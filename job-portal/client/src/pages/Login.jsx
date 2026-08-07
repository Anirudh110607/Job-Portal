import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Lock, Mail, ArrowRight, Sparkles, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success) {
        login(res.user, res.token);
        
        // Redirect based on role
        if (res.user.role === 'admin') navigate('/admin/dashboard');
        else if (res.user.role === 'recruiter') navigate('/recruiter/dashboard');
        else navigate('/candidate/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoUser = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold text-white">HirePulse</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">Sign in to manage your career applications or recruit top talent.</p>
        </div>

        {/* Demo Fast Logins */}
        <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 space-y-2 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            ⚡ Quick Demo Logins
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => fillDemoUser('candidate1@gmail.com')}
              className="py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-emerald-400 border border-slate-800 transition-colors"
            >
              Candidate
            </button>
            <button
              onClick={() => fillDemoUser('recruiter@techcorp.com')}
              className="py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-brand-400 border border-slate-800 transition-colors"
            >
              Recruiter
            </button>
            <button
              onClick={() => fillDemoUser('admin@hirepulse.com')}
              className="py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-amber-400 border border-slate-800 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-brand-400 hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              {loading ? 'Authenticating...' : 'Sign In to Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-400 hover:underline">
            Register for free
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
