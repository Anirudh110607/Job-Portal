import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Bookmark, Sparkles, Building2, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const JobCard = ({ job, onBookmarkToggle, onQuickApply }) => {
  const companyName = job.company?.name || 'Tech Company';
  const companyLogo = job.company?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=1e293b&color=6366f1`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between relative group border border-slate-800/80 hover:border-brand-500/40"
    >
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3.5">
            <img 
              src={companyLogo} 
              alt={companyName} 
              className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-800 p-1"
            />
            <div>
              <Link to={`/companies/${job.companyId?._id || job.companyId}`} className="text-xs font-semibold text-slate-400 hover:text-brand-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {companyName}
              </Link>
              <Link to={`/jobs/${job._id}`}>
                <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-brand-300 transition-colors line-clamp-1">
                  {job.title}
                </h3>
              </Link>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => onBookmarkToggle && onBookmarkToggle(job._id)}
            className={`p-2 rounded-xl border transition-all ${
              job.isBookmarked 
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-800'
            }`}
            title={job.isBookmarked ? 'Saved to bookmarks' : 'Save job'}
          >
            <Bookmark className={`w-4 h-4 ${job.isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Badges & Meta info */}
        <div className="flex flex-wrap items-center gap-2 my-3 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 font-medium flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {job.location}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            {job.workplaceType || 'Remote'}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 font-medium">
            {job.jobType || 'Full Time'}
          </span>
          {job.matchPercentage && (
            <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {job.matchPercentage}% Match
            </span>
          )}
        </div>

        {/* Salary */}
        <div className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          {job.salaryRange || '$90,000 - $130,000'}
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Tag Pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {job.skills && job.skills.slice(0, 4).map((skill, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-400 text-[11px] font-mono border border-slate-800">
              {skill}
            </span>
          ))}
          {job.skills && job.skills.length > 4 && (
            <span className="px-1.5 py-0.5 rounded-md bg-slate-900 text-slate-500 text-[10px]">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Posted recently
        </span>

        <div className="flex items-center gap-2">
          <Link
            to={`/jobs/${job._id}`}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 transition-colors border border-slate-800"
          >
            Details
          </Link>
          <button
            onClick={() => onQuickApply && onQuickApply(job)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-sm transition-all"
          >
            Apply Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
