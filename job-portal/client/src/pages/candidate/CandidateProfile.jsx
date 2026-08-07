import React, { useState } from 'react';
import { User, Mail, MapPin, Globe, Github, Linkedin, Save, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const CandidateProfile = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [availability, setAvailability] = useState(user?.availability || 'Immediate');
  const [skills, setSkills] = useState(user?.skills ? user.skills.join(', ') : 'React, Node.js, JavaScript, Tailwind CSS');
  const [portfolio, setPortfolio] = useState(user?.portfolio || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin || '');
  const [github, setGithub] = useState(user?.github || '');
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await api.put('/auth/profile', {
        name,
        bio,
        phone,
        location,
        availability,
        skills,
        portfolio,
        linkedin,
        github,
        resumeUrl
      });

      if (res.success) {
        updateUser(res.user);
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-white">Candidate Profile Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Keep your technical profile updated to maximize recruiter matching.</p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-400">Personal Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
              >
                <option value="Immediate">Immediate Start</option>
                <option value="2 Weeks">2 Weeks Notice</option>
                <option value="1 Month">1 Month Notice</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Professional Bio</label>
            <textarea
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Full Stack Engineer passionate about React, Node.js, and web performance..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
            ></textarea>
          </div>
        </div>

        {/* Technical Skills */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-400">Technical Skills</h3>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Comma-separated skills list</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, Node.js, Express, MongoDB, Tailwind CSS, TypeScript"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Links & Resume */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-400">Portfolio & Resume</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Portfolio Website</label>
              <input
                type="text"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://myportfolio.dev"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">LinkedIn Profile</label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">GitHub Profile</label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Resume Link (PDF)</label>
            <input
              type="text"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/your-resume/view"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 text-slate-100 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 shadow-lg shadow-brand-600/30 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>

      </form>

    </div>
  );
};

export default CandidateProfile;
