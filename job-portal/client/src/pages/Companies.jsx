import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, ExternalLink, Search } from 'lucide-react';
import api from '../services/api';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/companies?search=${search}`);
        if (res.success) setCompanies(res.companies || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Top Hiring Companies</h1>
          <p className="text-sm text-slate-400 mt-1">Discover leading technology organizations actively building product teams.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search company name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-200 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((comp) => (
          <div key={comp._id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src={comp.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(comp.name)}&background=1e293b&color=6366f1`}
                alt={comp.name}
                className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-700 p-1"
              />
              <div>
                <h3 className="text-base font-bold text-white">{comp.name}</h3>
                <p className="text-xs text-slate-400">{comp.industry || 'Technology'}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{comp.tagline || comp.about}</p>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
              <span className="text-emerald-400 font-bold">{comp.activeJobsCount || 2} Open Roles</span>
              <Link to={`/companies/${comp._id}`} className="text-brand-400 font-bold hover:underline flex items-center gap-1">
                View Profile <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Companies;
