import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.success) {
        setMessage(res.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Reset Password</h2>
          <p className="text-xs text-slate-400">Enter your registered email address to receive password reset instructions.</p>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
          {message ? (
            <div className="space-y-3 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-xs text-emerald-300 font-semibold">{message}</p>
              <Link to="/login" className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs inline-block mt-2">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md"
              >
                {loading ? 'Sending OTP...' : 'Send Reset Instructions'}
              </button>
            </form>
          )}
        </div>

        <div className="text-center">
          <Link to="/login" className="text-xs font-bold text-slate-400 hover:text-white inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
