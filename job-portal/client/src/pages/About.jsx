import React from 'react';
import { Briefcase, Shield, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-400">About HirePulse</span>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Enterprise Career Intelligence Engine</h1>
        <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          HirePulse is built to bridge candidate talent with hiring teams using high-speed API matching, transparent compensation, and AI ATS resume analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">AI ATS Optimizer</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Instant deep keyword extraction and ATS scoring tailored for full-stack, design, and AI positions.</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Role-Based Security</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Strict role-based access for Candidates, Recruiters, and Admins powered by JWT & bcrypt.</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Direct Recruiter Pipeline</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Recruiters schedule Google Meet interviews directly into candidate dashboard timelines.</p>
        </div>
      </div>

    </div>
  );
};

export default About;
