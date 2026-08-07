import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Send, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

const PostJob = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Software Engineering');
  const [jobType, setJobType] = useState('Full Time');
  const [workplaceType, setWorkplaceType] = useState('Remote');
  const [experienceLevel, setExperienceLevel] = useState('Mid Level');
  const [location, setLocation] = useState('San Francisco, CA (Remote)');
  const [salaryRange, setSalaryRange] = useState('$120,000 - $160,000 / year');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [skills, setSkills] = useState('React, Node.js, Express, MongoDB, Tailwind CSS');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/jobs', {
        title,
        category,
        jobType,
        workplaceType,
        experienceLevel,
        location,
        salaryRange,
        description,
        responsibilities,
        requirements,
        skills
      });

      if (res.success) {
        navigate('/recruiter/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to publish job posting');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-white">Post a New Position</h1>
        <p className="text-sm text-slate-400 mt-1">Publish job requirements to reach thousands of pre-vetted engineers.</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        
        {/* Role Overview */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-400">Position Overview</h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Software Engineer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="Design & Creative">Design & Creative</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Product Management">Product Management</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Workplace Type</label>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA (Remote)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Salary Range</label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="e.g. $130,000 - $170,000 / year"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Description & Requirements */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-400">Role Details</h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed summary of the role, team, and company culture..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Responsibilities (One per line)</label>
            <textarea
              rows="3"
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              placeholder="Architect clean React frontend components&#10;Optimize Node.js REST API response times"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Requirements (One per line)</label>
            <textarea
              rows="3"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="4+ years of React & Node.js experience&#10;Strong understanding of MongoDB / PostgreSQL"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Required Skills (Comma-separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, Node.js, Express, MongoDB, Tailwind CSS"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Publishing...' : 'Publish Job Listing'}
          </button>
        </div>

      </form>

    </div>
  );
};

export default PostJob;
