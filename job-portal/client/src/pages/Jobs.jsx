import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, Sparkles, AlertCircle } from 'lucide-react';
import JobCard from '../components/JobCard';
import FilterSidebar from '../components/FilterSidebar';
import ApplyModal from '../components/ApplyModal';
import api from '../services/api';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    jobType: searchParams.get('jobType') || 'All',
    workplaceType: searchParams.get('workplaceType') || 'All',
    experienceLevel: searchParams.get('experienceLevel') || 'All',
    page: searchParams.get('page') || 1
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category !== 'All') params.append('category', filters.category);
      if (filters.jobType !== 'All') params.append('jobType', filters.jobType);
      if (filters.workplaceType !== 'All') params.append('workplaceType', filters.workplaceType);
      if (filters.experienceLevel !== 'All') params.append('experienceLevel', filters.experienceLevel);
      params.append('page', filters.page);

      const res = await api.get(`/jobs?${params.toString()}`);
      if (res.success) {
        setJobs(res.jobs || []);
        setTotal(res.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const handleBookmarkToggle = async (jobId) => {
    try {
      const res = await api.post(`/jobs/${jobId}/bookmark`);
      if (res.success) {
        setJobs(prev => prev.map(j => j._id === jobId ? { ...j, isBookmarked: res.isBookmarked } : j));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Search Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Explore Engineering Jobs</h1>
        <p className="text-sm text-slate-400 mt-1">Found {total} positions matching your criteria</p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Job Cards Listing */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-64 glass-panel rounded-2xl animate-pulse bg-slate-900/60 p-6 border border-slate-800"></div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800 space-y-4">
              <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-xl font-bold text-white">No jobs matched your search</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">Try clearing some filters or searching for broader terms like "React" or "Engineer".</p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 text-sm"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onBookmarkToggle={handleBookmarkToggle}
                  onQuickApply={(j) => {
                    setSelectedJob(j);
                    setShowApplyModal(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Quick Apply Modal */}
      {showApplyModal && (
        <ApplyModal
          job={selectedJob}
          onClose={() => setShowApplyModal(false)}
        />
      )}

    </div>
  );
};

export default Jobs;
