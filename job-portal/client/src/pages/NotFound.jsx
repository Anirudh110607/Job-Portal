import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="space-y-6 max-w-md">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-white">404 - Page Not Found</h1>
        <p className="text-sm text-slate-400">The job listing or route you requested does not exist or has been moved.</p>
        <div>
          <Link to="/" className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-brand-600/30">
            <Home className="w-4 h-4" /> Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
