import React, { useState } from 'react';
import { X, Upload, CheckCircle2, FileText, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ApplyModal = ({ job, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [coverLetter, setCoverLetter] = useState(
    `Dear Hiring Team at ${job?.company?.name || 'Company'},\n\nI am thrilled to submit my application for the ${job?.title || 'position'}. With my background in ${user?.skills?.slice(0, 3).join(', ') || 'full-stack development'}, I am confident I can make an immediate positive impact on your team.`
  );
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/applications/apply', {
        jobId: job._id,
        coverLetter,
        resumeUrl
      });

      if (res.success) {
        // Trigger celebratory confetti animation!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (err) {
          // ignore if canvas-confetti missing
        }

        if (onSuccess) onSuccess(res.application);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Apply for {job.title}</h2>
            <p className="text-xs text-slate-400">{job.company?.name || 'Company'} • {job.location}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Cover Letter / Personal Statement
            </label>
            <textarea
              rows="5"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-200 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
              placeholder="Explain why you are a great fit for this position..."
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Resume Link or Attached Document
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/your-resume.pdf"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-200 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              You can also upload a PDF file directly from your candidate profile.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;
