import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  User, Bookmark, Briefcase, Calendar, Sparkles, Clock, 
  CheckCircle2, AlertCircle, FileText, ExternalLink, Bot, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import JobCard from '../../components/JobCard';
import AIAnalyzerModal from '../../components/AIAnalyzerModal';
import api from '../../services/api';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAIModal, setShowAIModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [appsRes, savedRes, intRes] = await Promise.all([
          api.get('/applications/my-applications'),
          api.get('/jobs/saved'),
          api.get('/interviews')
        ]);

        if (appsRes.success) setApplications(appsRes.applications || []);
        if (savedRes.success) setSavedJobs(savedRes.jobs || []);
        if (intRes.success) setInterviews(intRes.interviews || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const profileCompletion = Math.min(100, (
    (user?.bio ? 20 : 0) +
    (user?.skills?.length ? 30 : 0) +
    (user?.experience?.length ? 25 : 0) +
    (user?.resumeUrl ? 25 : 0)
  ));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Card Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-brand-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=fff`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-brand-500/30"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-white">Welcome back, {user?.name}! 👋</h1>
            <p className="text-xs text-slate-400 mt-1">Full Stack Candidate • {user?.location || 'San Francisco, CA'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/candidate/profile"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            Edit Candidate Profile
          </Link>
          <button
            onClick={() => setShowAIModal(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            AI Resume Tools
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Profile Strength</div>
          <div className="text-2xl font-extrabold text-white mt-1">{profileCompletion}%</div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
            <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${profileCompletion}%` }}></div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Applications Submitted</div>
          <div className="text-2xl font-extrabold text-brand-400 mt-1">{applications.length}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Scheduled Interviews</div>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">{interviews.length}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Bookmarked Jobs</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{savedJobs.length}</div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-800 gap-6 text-sm font-bold">
        <button
          onClick={() => setSearchParams({ tab: 'overview' })}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'overview' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          My Applications ({applications.length})
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'interviews' })}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'interviews' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Scheduled Interviews ({interviews.length})
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'saved' })}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'saved' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Saved Bookmarks ({savedJobs.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white">Application Pipeline & Statuses</h3>

          {applications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm space-y-3">
              <p>You haven't submitted any job applications yet.</p>
              <Link to="/jobs" className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs inline-block">
                Browse Active Jobs
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase font-bold text-slate-400 bg-slate-900/80 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Job Title & Company</th>
                    <th className="px-4 py-3">Applied Date</th>
                    <th className="px-4 py-3">AI Match %</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{app.job?.title || 'Engineering Position'}</div>
                        <div className="text-xs text-slate-400">{app.job?.company?.name || 'Tech Company'}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/20">
                          {app.matchPercentage || 88}% Match
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                          app.status === 'shortlisted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          app.status === 'interview' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                          app.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/jobs/${app.job?._id}`} className="text-xs text-brand-400 hover:underline flex items-center gap-1 font-bold">
                          View Job <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'interviews' && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white">Upcoming Interview Schedule</h3>

          {interviews.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No interviews scheduled yet. Recruiters will send invites directly to your calendar.
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.map((item) => (
                <div key={item._id} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                        {item.type || 'Video Call'}
                      </span>
                      <h4 className="text-base font-bold text-white">{item.job?.title || 'Interview'}</h4>
                    </div>
                    <p className="text-xs text-slate-400">Date: {item.date} • Time: {item.time}</p>
                    {item.notes && <p className="text-xs text-slate-300 italic pt-1">{item.notes}</p>}
                  </div>

                  {item.meetingLink && (
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 self-start md:self-auto"
                    >
                      Join Video Call <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}

      {/* AI Modal */}
      {showAIModal && (
        <AIAnalyzerModal onClose={() => setShowAIModal(false)} />
      )}

    </div>
  );
};

export default CandidateDashboard;
