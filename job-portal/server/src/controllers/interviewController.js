const Interview = require('../models/Interview');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const mockStore = require('../utils/mockStore');
const { getDbState } = require('../config/db');

exports.scheduleInterview = async (req, res, next) => {
  try {
    const { applicationId, jobId, candidateId, date, time, type, meetingLink, notes } = req.body;
    if (!applicationId || !candidateId || !date || !time) {
      return res.status(400).json({ success: false, message: 'Missing required interview fields (date, time, candidateId, applicationId)' });
    }

    const recruiterId = req.user._id;
    const { useMock } = getDbState();

    if (useMock) {
      const interview = mockStore.addInterview({
        applicationId,
        jobId,
        candidateId,
        recruiterId,
        date,
        time,
        type: type || 'Video Call',
        meetingLink: meetingLink || 'https://meet.google.com/xyz-abc-hire',
        notes: notes || 'Technical Screening & Architecture Discussion'
      });

      // Update application status to 'interview'
      mockStore.updateApplication(applicationId, { status: 'interview' });

      // Notify candidate
      mockStore.addNotification({
        userId: candidateId,
        title: 'Interview Scheduled! 📅',
        message: `An interview has been scheduled for ${date} at ${time} (${type}).`,
        type: 'interview'
      });

      return res.status(201).json({ success: true, message: 'Interview scheduled successfully', interview });
    }

    // MongoDB Mode
    const interview = await Interview.create({
      applicationId,
      jobId,
      candidateId,
      recruiterId,
      date,
      time,
      type: type || 'Video Call',
      meetingLink: meetingLink || 'https://meet.google.com/xyz-abc-hire',
      notes
    });

    await Application.findByIdAndUpdate(applicationId, { status: 'interview' });

    await Notification.create({
      userId: candidateId,
      title: 'Interview Scheduled! 📅',
      message: `An interview has been scheduled for ${date} at ${time} (${type}).`,
      type: 'interview'
    });

    return res.status(201).json({ success: true, message: 'Interview scheduled successfully', interview });
  } catch (error) {
    next(error);
  }
};

exports.getInterviews = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;
    const { useMock } = getDbState();

    if (useMock) {
      let filtered = mockStore.interviews;
      if (role === 'candidate') {
        filtered = filtered.filter(i => i.candidateId.toString() === userId.toString());
      } else if (role === 'recruiter') {
        filtered = filtered.filter(i => i.recruiterId.toString() === userId.toString());
      }

      const populated = filtered.map(i => {
        const job = mockStore.findJobById(i.jobId);
        const candidate = mockStore.findUserById(i.candidateId);
        const company = job ? mockStore.findCompanyById(job.companyId) : null;
        return {
          ...i,
          job: job ? { ...job, company: company || { name: 'Acme Corp' } } : null,
          candidate
        };
      });

      return res.json({ success: true, interviews: populated });
    }

    const query = role === 'candidate' ? { candidateId: userId } : { recruiterId: userId };
    const interviews = await Interview.find(query)
      .populate({
        path: 'jobId',
        populate: { path: 'companyId' }
      })
      .populate('candidateId', 'name email avatar phone')
      .sort({ createdAt: -1 });

    return res.json({ success: true, interviews });
  } catch (error) {
    next(error);
  }
};
