import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Github, Linkedin, Twitter, Sparkles, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">HirePulse</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The modern career intelligence platform connecting ambitious developers, designers, and AI specialists with top-tier technology companies.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors border border-slate-800">
                <Github className="w-4.5 h-4.5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors border border-slate-800">
                <Linkedin className="w-4.5 h-4.5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors border border-slate-800">
                <Twitter className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Col 2: For Job Seekers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Candidates</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-brand-400 transition-colors">Browse Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-brand-400 transition-colors">Explore Companies</Link></li>
              <li><Link to="/candidate/dashboard" className="hover:text-brand-400 transition-colors">AI Resume Checker</Link></li>
              <li><Link to="/jobs?jobType=Remote" className="hover:text-brand-400 transition-colors">Remote Positions</Link></li>
            </ul>
          </div>

          {/* Col 3: For Recruiters */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Recruiters</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/recruiter/post-job" className="hover:text-brand-400 transition-colors">Post a Job</Link></li>
              <li><Link to="/recruiter/dashboard" className="hover:text-brand-400 transition-colors">Candidate Pipeline</Link></li>
              <li><Link to="/register?role=recruiter" className="hover:text-brand-400 transition-colors">Recruiter Sign Up</Link></li>
              <li><Link to="/companies" className="hover:text-brand-400 transition-colors">Company Profiles</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Job Alerts</h4>
            <p className="text-xs text-slate-400">Get fresh full-stack and remote tech opportunities weekly.</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter email..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-200 text-sm border border-slate-800 focus:outline-none focus:border-brand-500 pr-10"
                />
                <button type="submit" className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-500 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HirePulse Inc. Built for Senior Portfolio & Enterprise scale.</p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-slate-300">Privacy Policy</Link>
            <Link to="/about" className="hover:text-slate-300">Terms of Service</Link>
            <Link to="/contact" className="hover:text-slate-300">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
