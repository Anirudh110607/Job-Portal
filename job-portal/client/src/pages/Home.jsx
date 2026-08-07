import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Sparkles, Briefcase, Building2, TrendingUp, 
  CheckCircle2, ArrowRight, Star, Bot, ShieldCheck, Users, Code, Palette, Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';
import AIAnalyzerModal from '../components/AIAnalyzerModal';
import api from '../services/api';

const categories = [
  { name: 'Software Engineering', count: '1,420+ Jobs', icon: Code, color: 'from-blue-500 to-indigo-600' },
  { name: 'Design & Creative', count: '850+ Jobs', icon: Palette, color: 'from-purple-500 to-pink-600' },
  { name: 'AI & Machine Learning', count: '620+ Jobs', icon: Cpu, color: 'from-emerald-500 to-teal-600' },
  { name: 'Product Management', count: '410+ Jobs', icon: TrendingUp, color: 'from-amber-500 to-orange-600' },
];

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, compRes] = await Promise.all([
          api.get('/jobs?limit=6'),
          api.get('/companies')
        ]);
        if (jobsRes.success) setFeaturedJobs(jobsRes.jobs || []);
        if (compRes.success) setCompanies(compRes.companies || []);
      } catch (err) {
        console.error('Failed to fetch home page data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationQuery)}`);
  };

  const handleQuickApply = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Glow background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-brand-500/30 text-brand-300 text-xs font-bold mb-8 shadow-lg shadow-brand-500/10"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            The Next-Gen Career Intelligence Platform
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15] max-w-4xl mx-auto"
          >
            Find Your Dream Job with <br className="hidden sm:block"/>
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              AI Precision & Direct Recruiter Match
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Discover 10,000+ verified engineering, product, design, and AI positions from world-class tech leaders and high-growth startups.
          </motion.p>

          {/* Search Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 max-w-4xl mx-auto"
          >
            <form onSubmit={handleSearchSubmit} className="glass-panel p-2.5 sm:p-3.5 rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 focus-within:border-brand-500">
                <Search className="w-5 h-5 text-brand-400" />
                <input
                  type="text"
                  placeholder="Job title, skills (e.g. React, Node.js)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
                />
              </div>

              <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 focus-within:border-brand-500">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <input
                  type="text"
                  placeholder="Location or Remote..."
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Search className="w-4 h-4" />
                Search Jobs
              </button>
            </form>

            {/* Popular Searches Tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-500">Trending:</span>
              {['Full Stack', 'React', 'Remote', 'Node.js', 'UI/UX', 'Python AI'].map((tag, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/jobs?search=${tag}`)}
                  className="px-3 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="glass-card p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl font-extrabold text-white">10,000+</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Active Job Listings</div>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl font-extrabold text-emerald-400">94%</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">ATS Resume Match Rate</div>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl font-extrabold text-brand-400">1,250+</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Verified Tech Companies</div>
            </div>
            <div className="glass-card p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl font-extrabold text-amber-400">48 Hours</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Avg Recruiter Response</div>
            </div>
          </div>

        </div>
      </section>

      {/* AI Resume Analyzer Feature Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-brand-500/30 relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                <Bot className="w-4 h-4" /> AI ATS Resume Checker
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Beat the ATS Algorithm & Double Your Interview Invites
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Upload your resume to get instant ATS scores, keyword gap analyses, and AI recommendations tailored for senior tech roles.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setShowAIModal(true)}
                  className="px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-600/30 inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Try AI Resume Analyzer Free
                </button>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-700/80 w-full md:w-80 shrink-0 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">ATS Score Preview</span>
                <span className="text-xs font-bold text-emerald-400">92/100</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 w-[92%]"></div>
              </div>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> React & Node.js keywords matched
                </div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Clear impact bullet points
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Featured Positions</h2>
            <p className="text-sm text-slate-400 mt-1">Hand-picked high-growth opportunities from leading hiring teams.</p>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 group"
          >
            Explore All Jobs
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <JobCard key={job._id} job={job} onQuickApply={handleQuickApply} />
          ))}
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white">Popular Job Categories</h2>
          <p className="text-sm text-slate-400 mt-2">Explore opportunities by specialized engineering domain.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
                className="glass-card p-6 rounded-2xl border border-slate-800 cursor-pointer group hover:border-brand-500/50"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white font-bold mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">{cat.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{cat.count}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modals */}
      {showApplyModal && (
        <ApplyModal
          job={selectedJob}
          onClose={() => setShowApplyModal(false)}
        />
      )}

      {showAIModal && (
        <AIAnalyzerModal onClose={() => setShowAIModal(false)} />
      )}

    </div>
  );
};

export default Home;
