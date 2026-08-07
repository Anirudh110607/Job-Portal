import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Briefcase, Search, Sparkles, User, LogOut, Sun, Moon, 
  Menu, X, Bell, LayoutDashboard, Shield, Building2, Bookmark, FileText, CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'recruiter') return '/recruiter/dashboard';
    return '/candidate/dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                HirePulse
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1 animate-pulse"></span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/jobs" 
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                location.pathname === '/jobs' ? 'text-brand-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              Find Jobs
            </Link>

            <Link 
              to="/companies" 
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                location.pathname === '/companies' ? 'text-brand-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Companies
            </Link>

            <Link 
              to="/about" 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              About
            </Link>

            <Link 
              to="/contact" 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Action Buttons & Profile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/60 transition-all"
                >
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-brand-500/30"
                  />
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-100 max-w-[100px] truncate">{user.name}</div>
                    <div className="text-[10px] text-emerald-400 capitalize font-semibold">{user.role}</div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel border border-slate-700/80 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>

                    <Link
                      to={getDashboardLink()}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-brand-600/20 hover:text-brand-300 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-brand-400" />
                      Dashboard
                    </Link>

                    {user.role === 'candidate' && (
                      <>
                        <Link
                          to="/candidate/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-brand-600/20 hover:text-brand-300 transition-colors"
                        >
                          <User className="w-4 h-4 text-emerald-400" />
                          My Profile
                        </Link>
                        <Link
                          to="/candidate/dashboard?tab=saved"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-brand-600/20 hover:text-brand-300 transition-colors"
                        >
                          <Bookmark className="w-4 h-4 text-amber-400" />
                          Saved Jobs
                        </Link>
                      </>
                    )}

                    {user.role === 'recruiter' && (
                      <Link
                        to="/recruiter/post-job"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-brand-600/20 hover:text-brand-300 transition-colors"
                      >
                        <Briefcase className="w-4 h-4 text-indigo-400" />
                        Post a Job
                      </Link>
                    )}

                    <div className="border-t border-slate-800 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4.5 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-600/30 transition-all hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800 text-slate-300"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/80"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 space-y-3 bg-slate-900 border-b border-slate-800">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-slate-200 font-medium hover:bg-slate-800 rounded-lg"
          >
            Find Jobs
          </Link>
          <Link
            to="/companies"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-slate-200 font-medium hover:bg-slate-800 rounded-lg"
          >
            Companies
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-brand-400 font-bold hover:bg-slate-800 rounded-lg"
              >
                Dashboard ({user.role})
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full text-left px-3 py-2 text-rose-400 font-medium hover:bg-slate-800 rounded-lg"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-slate-200 bg-slate-800 rounded-xl font-semibold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-white bg-brand-600 rounded-xl font-bold"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
