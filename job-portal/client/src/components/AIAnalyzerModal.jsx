import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, AlertTriangle, FileText, BarChart3, Bot } from 'lucide-react';
import api from '../services/api';

const AIAnalyzerModal = ({ onClose }) => {
  const [resumeText, setResumeText] = useState(
    'Alex Rivera - Senior Full Stack Software Engineer with 4+ years of hands-on experience building scalable web apps with React.js, Node.js, Express, MongoDB, and Tailwind CSS. Built micro-frontend architectures serving over 500,000 monthly active users. Proficient in TypeScript, RESTful APIs, JWT Auth, and Docker.'
  );
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/ai/analyze-resume', { resumeText, targetRole });
      if (res.success) {
        setResult(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-lg shadow-brand-500/25">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              AI Resume Analyzer & ATS Checker
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase font-mono">GPT Powered</span>
            </h2>
            <p className="text-xs text-slate-400">Optimize your resume keyword density and pass ATS filters effortlessly.</p>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Target Job Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 text-slate-200 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
              placeholder="e.g. Full Stack Developer, Senior Product Designer"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Paste Resume Content or Summary
            </label>
            <textarea
              rows="4"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 text-slate-200 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            {loading ? 'Analyzing with AI...' : 'Run ATS Score Analysis'}
            <Sparkles className="w-4 h-4 text-amber-300" />
          </button>
        </form>

        {/* Results */}
        {result && (
          <div className="pt-6 border-t border-slate-800 space-y-6 animate-in slide-in-from-bottom-2">
            
            {/* Score Card */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/60">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Estimated ATS Score</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">{result.atsScore} <span className="text-sm font-normal text-slate-400">/ 100</span></h3>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center font-extrabold text-emerald-400 text-lg">
                {result.atsScore}%
              </div>
            </div>

            {/* Keyword breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <p className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Matched Industry Keywords
                </p>
                <div className="flex flex-wrap gap-1">
                  {result.matchedKeywords?.map((k, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-xs font-mono">
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <p className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Recommended Keywords to Add
                </p>
                <div className="flex flex-wrap gap-1">
                  {result.missingKeywords?.map((k, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-xs font-mono">
                      +{k}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-200">AI Actionable Recommendations:</h4>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-400">
                {result.improvements?.map((imp, i) => (
                  <li key={i} className="leading-relaxed">{imp}</li>
                ))}
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AIAnalyzerModal;
