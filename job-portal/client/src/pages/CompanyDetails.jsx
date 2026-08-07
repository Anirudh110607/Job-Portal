import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, MapPin, Globe, Users, ArrowLeft } from 'lucide-react';
import JobCard from '../components/JobCard';
import api from '../services/api';

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/companies/${id}`);
        if (res.success) {
          setCompany(res.company);
          setJobs(res.jobs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">Loading company details...</div>;
  }

  if (!company) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">Company not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <Link to="/companies" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Companies
      </Link>

      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-6">
        <div className="flex items-center gap-5">
          <img
            src={company.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=1e293b&color=6366f1`}
            alt={company.name}
            className="w-20 h-20 rounded-2xl object-cover border border-slate-700 p-1 bg-slate-900"
          />
          <div>
            <h1 className="text-3xl font-extrabold text-white">{company.name}</h1>
            <p className="text-sm text-slate-400 mt-1">{company.tagline || company.industry}</p>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {company.location}</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-500" /> {company.size}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">About the Organization</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{company.about}</p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-white">Open Positions ({jobs.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={{ ...job, company }} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default CompanyDetails;
