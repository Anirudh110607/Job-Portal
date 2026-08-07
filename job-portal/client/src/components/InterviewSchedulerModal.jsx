import React, { useState } from 'react';
import { X, Calendar, Clock, Video, Send } from 'lucide-react';
import api from '../services/api';

const InterviewSchedulerModal = ({ application, onClose, onSuccess }) => {
  const [date, setDate] = useState('2026-08-15');
  const [time, setTime] = useState('14:00 EST');
  const [type, setType] = useState('Video Call');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/hirepulse-tech-call');
  const [notes, setNotes] = useState('Technical Screening & System Architecture Deep Dive');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSchedule = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/interviews/schedule', {
        applicationId: application._id,
        jobId: application.jobId?._id || application.jobId,
        candidateId: application.candidateId?._id || application.candidateId,
        date,
        time,
        type,
        meetingLink,
        notes
      });

      if (res.success) {
        if (onSuccess) onSuccess(res.interview);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to schedule interview');
    } finally {
      setSubmitting(false);
    }
  };

  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg glass-panel rounded-3xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Schedule Candidate Interview</h2>
            <p className="text-xs text-slate-400">Candidate: {application.candidate?.name || 'Candidate'}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSchedule} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Interview Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 text-slate-200 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Time Slot
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 14:00 EST"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 text-slate-200 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Interview Format
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 text-slate-200 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
            >
              <option value="Video Call">Google Meet / Zoom (Video Call)</option>
              <option value="Phone Call">Phone Screening</option>
              <option value="On-site">In-Person / On-site</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Meeting Link
            </label>
            <input
              type="text"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 text-slate-200 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Agenda & Preparation Notes
            </label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 text-slate-200 text-sm border border-slate-800 focus:outline-none focus:border-brand-500"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md flex items-center gap-2"
            >
              {submitting ? 'Scheduling...' : 'Send Interview Invite'}
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default InterviewSchedulerModal;
