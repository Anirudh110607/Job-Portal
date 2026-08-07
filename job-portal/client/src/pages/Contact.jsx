import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Contact HirePulse Support</h1>
        <p className="text-sm text-slate-400">Have questions about recruiter onboarding or candidate accounts? Get in touch.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-3">
            <Mail className="w-5 h-5 text-brand-400" />
            <div>
              <div className="text-xs text-slate-400">Email Support</div>
              <div className="text-xs font-bold text-white">support@hirepulse.com</div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-3">
            <Phone className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-xs text-slate-400">Phone Hotline</div>
              <div className="text-xs font-bold text-white">+1 (800) 555-HIRE</div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800">
          {submitted ? (
            <div className="py-10 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Message Sent Successfully!</h3>
              <p className="text-xs text-slate-400">Our engineering team will respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Your Name</label>
                <input type="text" required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
                <input type="email" required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Message</label>
                <textarea rows="4" required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"></textarea>
              </div>
              <button type="submit" className="w-full py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md flex items-center justify-center gap-2">
                Send Message <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
};

export default Contact;
