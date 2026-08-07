const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const mockStore = require('../utils/mockStore');
const { getDbState } = require('../config/db');

exports.getAdminStats = async (req, res, next) => {
  try {
    const { useMock } = getDbState();

    if (useMock) {
      const totalUsers = mockStore.users.length;
      const totalCandidates = mockStore.users.filter(u => u.role === 'candidate').length;
      const totalRecruiters = mockStore.users.filter(u => u.role === 'recruiter').length;
      const totalJobs = mockStore.jobs.length;
      const activeJobs = mockStore.jobs.filter(j => j.status === 'active').length;
      const totalApplications = mockStore.applications.length;
      const totalCompanies = mockStore.companies.length;

      return res.json({
        success: true,
        stats: {
          totalUsers,
          totalCandidates,
          totalRecruiters,
          totalJobs,
          activeJobs,
          totalApplications,
          totalCompanies
        }
      });
    }

    const totalUsers = await User.countDocuments();
    const totalCandidates = await User.countDocuments({ role: 'candidate' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalApplications = await Application.countDocuments();
    const totalCompanies = await Company.countDocuments();

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalJobs,
        activeJobs,
        totalApplications,
        totalCompanies
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { useMock } = getDbState();

    if (useMock) {
      const usersSansPass = mockStore.users.map(u => {
        const copy = { ...u };
        delete copy.password;
        return copy;
      });
      return res.json({ success: true, users: usersSansPass });
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params; // userId
    const { useMock } = getDbState();

    if (useMock) {
      const user = mockStore.findUserById(id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      user.status = user.status === 'active' ? 'banned' : 'active';
      return res.json({ success: true, message: `User status changed to ${user.status}`, user });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.status = user.status === 'active' ? 'banned' : 'active';
    await user.save();

    return res.json({ success: true, message: `User status changed to ${user.status}`, user });
  } catch (error) {
    next(error);
  }
};

exports.approveRecruiter = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const { useMock } = getDbState();

    if (useMock) {
      const company = mockStore.findCompanyById(companyId);
      if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
      company.isApproved = true;
      return res.json({ success: true, message: 'Recruiter organization approved', company });
    }

    const company = await Company.findByIdAndUpdate(companyId, { isApproved: true }, { new: true });
    return res.json({ success: true, message: 'Recruiter organization approved', company });
  } catch (error) {
    next(error);
  }
};
