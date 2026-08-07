const Company = require('../models/Company');
const Job = require('../models/Job');
const mockStore = require('../utils/mockStore');
const { getDbState } = require('../config/db');

exports.getCompanies = async (req, res, next) => {
  try {
    const { search } = req.query;
    const { useMock } = getDbState();

    if (useMock) {
      let filtered = [...mockStore.companies];
      if (search) {
        filtered = filtered.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
      }

      const withJobsCount = filtered.map(company => {
        const activeJobsCount = mockStore.jobs.filter(j => j.companyId.toString() === company._id.toString() && j.status === 'active').length;
        return { ...company, activeJobsCount };
      });

      return res.json({ success: true, companies: withJobsCount });
    }

    const query = { isApproved: true };
    if (search) query.name = { $regex: search, $options: 'i' };

    const companies = await Company.find(query);
    const result = await Promise.all(companies.map(async (company) => {
      const activeJobsCount = await Job.countDocuments({ companyId: company._id, status: 'active' });
      return { ...company.toObject(), activeJobsCount };
    }));

    return res.json({ success: true, companies: result });
  } catch (error) {
    next(error);
  }
};

exports.getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { useMock } = getDbState();

    if (useMock) {
      const company = mockStore.findCompanyById(id);
      if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

      const openJobs = mockStore.jobs.filter(j => j.companyId.toString() === id.toString() && j.status === 'active');
      return res.json({ success: true, company, jobs: openJobs });
    }

    const company = await Company.findById(id);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

    const openJobs = await Job.find({ companyId: id, status: 'active' });
    return res.json({ success: true, company, jobs: openJobs });
  } catch (error) {
    next(error);
  }
};

exports.updateCompany = async (req, res, next) => {
  try {
    const { name, tagline, about, website, industry, size, location } = req.body;
    const { useMock } = getDbState();

    if (useMock) {
      let company = mockStore.findCompanyByRecruiter(req.user._id);
      if (!company) {
        company = mockStore.addCompany({ name: name || `${req.user.name}'s Company`, recruiterId: req.user._id });
      }
      company = mockStore.findCompanyById(company._id);
      Object.assign(company, { name, tagline, about, website, industry, size, location });
      return res.json({ success: true, message: 'Company profile updated', company });
    }

    let company = await Company.findOne({ recruiterId: req.user._id });
    if (!company) {
      company = await Company.create({ name: name || 'Company', recruiterId: req.user._id });
    }

    company = await Company.findByIdAndUpdate(company._id, {
      name, tagline, about, website, industry, size, location
    }, { new: true });

    return res.json({ success: true, message: 'Company profile updated', company });
  } catch (error) {
    next(error);
  }
};
