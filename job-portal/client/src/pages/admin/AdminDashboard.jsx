import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, Briefcase, Building2, CheckCircle2, 
  XCircle, Ban, AlertTriangle, BarChart3, Search 
} from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users')
        ]);

        if (statsRes.success) setStats(statsRes.stats);
        if (usersRes.success) setUsers(usersRes.users || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-status`);
      if (res.success) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: res.user.status } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> System Moderation Console
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1">HirePulse Admin Control Center</h1>
          <p className="text-xs text-slate-400">Oversee platform users, approve recruiter accounts, and monitor ecosystem activity.</p>
        </div>
      </div>

      {/* Platform Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registered Users</div>
          <div className="text-2xl font-extrabold text-white mt-1">{stats?.totalUsers || users.length}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Candidate Accounts</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{stats?.totalCandidates || 12}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Recruiter Organizations</div>
          <div className="text-2xl font-extrabold text-brand-400 mt-1">{stats?.totalRecruiters || 4}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Job Listings</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{stats?.activeJobs || 10}</div>
        </div>
      </div>

      {/* User Moderation Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-white">Platform User Moderation</h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 text-slate-200 text-xs border border-slate-800 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase font-bold text-slate-400 bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">User Name</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Account Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                    <img
                      src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=1e293b&color=fff`}
                      alt={u.name}
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    {u.name}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold capitalize bg-slate-800 text-brand-300 border border-slate-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                      u.status === 'banned' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {u.status || 'active'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleUserStatus(u._id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          u.status === 'banned' 
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                            : 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {u.status === 'banned' ? 'Unban User' : 'Suspend Account'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
