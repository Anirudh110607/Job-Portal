import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Briefcase, Plus, Users, Calendar, CheckCircle2, XCircle, 
  Clock, Sparkles, ExternalLink, Trash2, Edit, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import InterviewSchedulerModal from '../../components/InterviewSchedulerModal';
import api from '../../services/api';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'jobs';

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobsRes, intRes] = await Promise.all([
          api.get('/jobs'),
          api.get('/interviews')
        ]);

        if (jobsRes.success) {
          const recruiterJobs = jobsRes.jobs.filter(j => j.recruiterId?.toString() === user?._id?.toString() || j.company?.name);
          setJobs(recruiterJobs.length > 0 ? recruiterJobs : jobsRes.jobs.slice(0, 4));
        }

        if (intRes.success) setInterviews(intRes.interviews || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateStatus = async (appId, status) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, { status });
      if (res.success) {
        setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleJobDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      const res = await api.delete(`/jobs/${jobId}`);
      if (res.success) {
        setJobs(prev => prev.filter(j => j._id !== jobId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Employer Portal</span>
          <h1 className="text-2xl font-extrabold text-white mt-1">Recruiter Command Center</h1>
          <p className="text-xs text-slate-400">Manage posted positions, evaluate candidates, and schedule technical interviews.</p>
        </div>

        <Link
          to="/recruiter/post-job"
          className="px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-xl shadow-brand-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Post New Position
        </Link>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Posted Jobs</div>
          <div className="text-2xl font-extrabold text-white mt-1">{jobs.length}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Listings</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {jobs.filter(j => j.status === 'active').length}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Candidates</div>
          <div className="text-2xl font-extrabold text-brand-400 mt-1">
            {jobs.reduce((acc, j) => acc + (j.applicationsCount || 1), 0)}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Interviews Today</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{interviews.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6 text-sm font-bold">
        <button
          onClick={() => setSearchParams({ tab: 'jobs' })}
          className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'jobs' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Manage Positions ({jobs.length})
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
      </div>

      {/* Tab 1: Job Postings */}
      {activeTab === 'jobs' && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white">Active Job Postings</h3>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">{job.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      job.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{job.location} • {job.jobType} • {job.salaryRange}</p>
                  <p className="text-xs text-brand-400 font-semibold">{job.applicationsCount || 0} Candidate Applications</p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800"
                  >
                    Preview
                  </Link>
                  <button
                    onClick={() => handleJobDelete(job._id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Scheduled Interviews */}
      {activeTab === 'interviews' && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white">Recruiter Interview Schedule</h3>

          {interviews.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No upcoming candidate interviews scheduled.
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.map((item) => (
                <div key={item._id} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-white">{item.candidate?.name || 'Candidate'}</h4>
                    <p className="text-xs text-slate-400">Position: {item.job?.title || 'Engineer'} • Date: {item.date} at {item.time}</p>
                    <p className="text-xs text-slate-300 mt-1 italic">{item.notes}</p>
                  </div>
                  {item.meetingLink && (
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2"
                    >
                      Open Video Meeting <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interview Modal */}
      {showInterviewModal && (
        <InterviewSchedulerModal
          application={selectedApplication}
          onClose={() => setShowInterviewModal(false)}
          onSuccess={() => {
            setInterviews(prev => [...prev, { _id: Date.now(), candidate: selectedApplication?.candidate, date: '2026-08-15', time: '14:00 EST' }]);
          }}
        />
      )}

    </div>
  );
};

export default RecruiterDashboard;
