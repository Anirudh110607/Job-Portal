import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Briefcase, Lock, Mail, User, Building2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [role, setRole] = useState(searchParams.get('role') || 'candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
        companyName
      });

      if (res.success) {
        login(res.user, res.token);
        if (role === 'recruiter') navigate('/recruiter/dashboard');
        else navigate('/candidate/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold text-white">HirePulse</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-white">Create Your Account</h2>
          <p className="text-xs text-slate-400">Join thousands of software professionals and recruiters.</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 glass-panel rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setRole('candidate')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              role === 'candidate' 
                ? 'bg-brand-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            Candidate
          </button>
          <button
            type="button"
            onClick={() => setRole('recruiter')}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              role === 'recruiter' 
                ? 'bg-brand-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Recruiter / Employer
          </button>
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
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            {role === 'recruiter' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. TechCorp Systems"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Work Email
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters..."
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              {loading ? 'Creating Account...' : `Register as ${role === 'recruiter' ? 'Recruiter' : 'Candidate'}`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-400 hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
