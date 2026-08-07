import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, MapPin, DollarSign, Clock, Bookmark, Sparkles, 
  CheckCircle2, Share2, Globe, Shield, ArrowLeft, Send, Users 
} from 'lucide-react';
import ApplyModal from '../components/ApplyModal';
import JobCard from '../components/JobCard';
import api from '../services/api';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/jobs/${id}`);
        if (res.success) {
          setJob(res.job);
          setSimilarJobs(res.similarJobs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-96 glass-panel rounded-3xl animate-pulse bg-slate-900/60 p-8 border border-slate-800"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Job Posting Not Found</h2>
        <Link to="/jobs" className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold inline-block">
          Back to All Jobs
        </Link>
      </div>
    );
  }

  const company = job.company || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back Button */}
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs
      </Link>

      {/* Main Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={company.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name || 'Company')}&background=1e293b&color=6366f1`}
              alt={company.name}
              className="w-16 h-16 rounded-2xl object-cover bg-slate-900 border border-slate-700 p-1.5 shrink-0"
            />
            <div className="space-y-1">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">{company.name}</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{job.workplaceType}</span>
                <span>•</span>
                <span className="text-indigo-400 font-semibold">{job.jobType}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              title="Share job"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowApplyModal(true)}
              className="px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 shadow-xl shadow-brand-600/30 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Apply For Position
            </button>
          </div>
        </div>

        {copied && (
          <div className="text-xs text-emerald-400 font-bold">Link copied to clipboard!</div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Job Description */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Description */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">About the Position</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Key Responsibilities</h3>
              <ul className="space-y-2.5">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Role Requirements</h3>
              <ul className="space-y-2.5">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Right Sidebar: Meta & Company Card */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Job Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Compensation:</span>
                <span className="font-bold text-emerald-400">{job.salaryRange}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Experience Level:</span>
                <span className="font-bold text-slate-200">{job.experienceLevel}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Category:</span>
                <span className="font-bold text-slate-200">{job.category}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">About Company</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{company.about || 'Innovative software engineering enterprise.'}</p>
            {company.website && (
              <a href={company.website} target="_blank" rel="noreferrer" className="text-xs text-brand-400 font-bold flex items-center gap-1 hover:underline">
                <Globe className="w-3.5 h-3.5" />
                Visit Website
              </a>
            )}
          </div>
        </div>

      </div>

      {/* Quick Apply Modal */}
      {showApplyModal && (
        <ApplyModal
          job={job}
          onClose={() => setShowApplyModal(false)}
        />
      )}

    </div>
  );
};

export default JobDetails;
