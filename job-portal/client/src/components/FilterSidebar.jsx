import React from 'react';
import { Search, Filter, RotateCcw, Briefcase, MapPin, Layers, Award } from 'lucide-react';

const categories = [
  'All',
  'Software Engineering',
  'Design & Creative',
  'AI & Machine Learning',
  'Product Management',
  'Data Science',
  'DevOps & Cloud'
];

const jobTypes = ['All', 'Full Time', 'Part Time', 'Contract', 'Internship'];
const workplaceTypes = ['All', 'Remote', 'Hybrid', 'On-site'];
const experienceLevels = ['All', 'Entry Level', 'Mid Level', 'Senior Level', 'Lead / Executive'];

const FilterSidebar = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="glass-panel rounded-2xl p-5 space-y-6 border border-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Filter className="w-4 h-4 text-brand-400" />
          Filter Jobs
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-400 hover:text-brand-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Keyword Search */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Search Keyword
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Title, skill, or keyword..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 text-slate-200 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-brand-400" />
          Category
        </label>
        <select
          value={filters.category || 'All'}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-900 text-slate-200 text-sm border border-slate-800 focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Workplace Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          Location Type
        </label>
        <div className="space-y-1.5">
          {workplaceTypes.map((type, i) => (
            <label key={i} className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white cursor-pointer py-1">
              <input
                type="radio"
                name="workplaceType"
                value={type}
                checked={(filters.workplaceType || 'All') === type}
                onChange={() => onFilterChange('workplaceType', type)}
                className="w-4 h-4 accent-brand-500 bg-slate-900 border-slate-700"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Job Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
          Employment Type
        </label>
        <div className="space-y-1.5">
          {jobTypes.map((type, i) => (
            <label key={i} className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white cursor-pointer py-1">
              <input
                type="radio"
                name="jobType"
                value={type}
                checked={(filters.jobType || 'All') === type}
                onChange={() => onFilterChange('jobType', type)}
                className="w-4 h-4 accent-brand-500 bg-slate-900 border-slate-700"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          Experience Level
        </label>
        <select
          value={filters.experienceLevel || 'All'}
          onChange={(e) => onFilterChange('experienceLevel', e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-900 text-slate-200 text-sm border border-slate-800 focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          {experienceLevels.map((lvl, i) => (
            <option key={i} value={lvl}>{lvl}</option>
          ))}
        </select>
      </div>

    </div>
  );
};

export default FilterSidebar;
