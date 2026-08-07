const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');
const mockStore = require('../utils/mockStore');
const { getDbState } = require('../config/db');

// AI Match Score Calculation Helper
const calculateMatchPercentage = (candidateSkills = [], jobSkills = []) => {
  if (!jobSkills.length) return 88;
  if (!candidateSkills.length) return 72;

  const normalizedCandidate = candidateSkills.map(s => s.toLowerCase());
  const normalizedJob = jobSkills.map(s => s.toLowerCase());

  let matches = 0;
  normalizedJob.forEach(skill => {
    if (normalizedCandidate.some(cs => cs.includes(skill) || skill.includes(cs))) {
      matches += 1;
    }
  });

  const ratio = matches / normalizedJob.length;
  const score = Math.round(65 + (ratio * 32)); // score between 65% and 97%
  return Math.min(99, Math.max(60, score));
};

exports.applyJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter, resumeUrl } = req.body;
    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required' });
    }

    const candidateId = req.user._id;
    const { useMock } = getDbState();

    if (useMock) {
      const existing = mockStore.findApplication(jobId, candidateId);
      if (existing) {
        return res.status(400).json({ success: false, message: 'You have already submitted an application for this position' });
      }

      const job = mockStore.findJobById(jobId);
      if (!job) return res.status(404).json({ success: false, message: 'Job posting not found' });

      const matchPercentage = calculateMatchPercentage(req.user.skills, job.skills);

      const application = mockStore.addApplication({
        jobId,
        candidateId,
        coverLetter: coverLetter || '',
        resumeUrl: resumeUrl || req.user.resumeUrl || '',
        matchPercentage
      });

      // Send notification to recruiter
      mockStore.addNotification({
        userId: job.recruiterId,
        title: 'New Application Received',
        message: `${req.user.name} applied for ${job.title} (${matchPercentage}% Match)`,
        type: 'application_update'
      });

      return res.status(201).json({
        success: true,
        message: 'Application submitted successfully!',
        application
      });
    }

    // MongoDB Mode
    const existing = await Application.findOne({ jobId, candidateId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already submitted an application for this position' });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job posting not found' });

    const matchPercentage = calculateMatchPercentage(req.user.skills, job.skills);

    const application = await Application.create({
      jobId,
      candidateId,
      coverLetter: coverLetter || '',
      resumeUrl: resumeUrl || req.user.resumeUrl || '',
      matchPercentage
    });

    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

    await Notification.create({
      userId: job.recruiterId,
      title: 'New Application Received',
      message: `${req.user.name} applied for ${job.title} (${matchPercentage}% Match)`,
      type: 'application_update'
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application
    });
  } catch (error) {
    next(error);
  }
};

exports.getCandidateApplications = async (req, res, next) => {
  try {
    const candidateId = req.user._id;
    const { useMock } = getDbState();

    if (useMock) {
      const userApps = mockStore.applications.filter(a => a.candidateId.toString() === candidateId.toString());
      const populated = userApps.map(app => {
        const job = mockStore.findJobById(app.jobId);
        const company = job ? mockStore.findCompanyById(job.companyId) : null;
        return {
          ...app,
          job: job ? { ...job, company: company || { name: 'Tech Ventures' } } : null
        };
      });

      return res.json({ success: true, applications: populated });
    }

    const applications = await Application.find({ candidateId })
      .populate({
        path: 'jobId',
        populate: { path: 'companyId' }
      })
      .sort({ createdAt: -1 });

    const formatted = applications.map(app => ({
      ...app.toObject(),
      job: app.jobId ? { ...app.jobId.toObject(), company: app.jobId.companyId } : null
    }));

    return res.json({ success: true, applications: formatted });
  } catch (error) {
    next(error);
  }
};

exports.getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { useMock } = getDbState();

    if (useMock) {
      const jobApps = mockStore.applications.filter(a => a.jobId.toString() === jobId.toString());
      const populated = jobApps.map(app => {
        const candidate = mockStore.findUserById(app.candidateId) || {
          name: 'Candidate User',
          email: 'candidate@example.com',
          skills: ['React', 'JavaScript', 'Node.js']
        };
        return {
          ...app,
          candidate
        };
      });

      return res.json({ success: true, applications: populated });
    }

    const applications = await Application.find({ jobId })
      .populate('candidateId', 'name email avatar phone bio location skills resumeUrl portfolio linkedin github experience education')
      .sort({ createdAt: -1 });

    const formatted = applications.map(app => ({
      ...app.toObject(),
      candidate: app.candidateId
    }));

    return res.json({ success: true, applications: formatted });
  } catch (error) {
    next(error);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, recruiterNotes } = req.body;

    const { useMock } = getDbState();

    if (useMock) {
      const updated = mockStore.updateApplication(id, { status, recruiterNotes });
      if (!updated) return res.status(404).json({ success: false, message: 'Application not found' });

      // Notify candidate
      mockStore.addNotification({
        userId: updated.candidateId,
        title: `Application Status Updated: ${status.toUpperCase()}`,
        message: `Your application status has been updated to '${status}'.`,
        type: status === 'rejected' ? 'rejected' : 'application_update'
      });

      return res.json({ success: true, message: `Application status updated to ${status}`, application: updated });
    }

    const updated = await Application.findByIdAndUpdate(
      id,
      { status, recruiterNotes },
      { new: true }
    ).populate('jobId candidateId');

    if (!updated) return res.status(404).json({ success: false, message: 'Application not found' });

    await Notification.create({
      userId: updated.candidateId._id,
      title: `Application Status Updated: ${status.toUpperCase()}`,
      message: `Your application for ${updated.jobId.title} has been updated to '${status}'.`,
      type: status === 'rejected' ? 'rejected' : 'application_update'
    });

    return res.json({ success: true, message: `Application status updated to ${status}`, application: updated });
  } catch (error) {
    next(error);
  }
};
