const Job = require('../models/Job');
const Company = require('../models/Company');
const Bookmark = require('../models/Bookmark');
const mockStore = require('../utils/mockStore');
const { getDbState } = require('../config/db');

exports.getJobs = async (req, res, next) => {
  try {
    const { 
      search, category, jobType, workplaceType, 
      experienceLevel, minSalary, maxSalary, page = 1, limit = 12 
    } = req.query;

    const { useMock } = getDbState();

    if (useMock) {
      let filtered = [...mockStore.jobs];

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(j => 
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          (j.skills && j.skills.some(s => s.toLowerCase().includes(q)))
        );
      }

      if (category && category !== 'All') {
        filtered = filtered.filter(j => j.category.toLowerCase() === category.toLowerCase());
      }

      if (jobType && jobType !== 'All') {
        filtered = filtered.filter(j => j.jobType.toLowerCase() === jobType.toLowerCase());
      }

      if (workplaceType && workplaceType !== 'All') {
        filtered = filtered.filter(j => j.workplaceType.toLowerCase() === workplaceType.toLowerCase());
      }

      if (experienceLevel && experienceLevel !== 'All') {
        filtered = filtered.filter(j => j.experienceLevel.toLowerCase() === experienceLevel.toLowerCase());
      }

      // Attach company details to mock jobs
      const populated = filtered.map(job => {
        const company = mockStore.findCompanyById(job.companyId) || {
          name: 'Tech Ventures',
          logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
          location: job.location
        };

        const isBookmarked = req.user ? mockStore.isBookmarked(req.user._id, job._id) : false;

        return {
          ...job,
          company,
          isBookmarked
        };
      });

      const total = populated.length;
      const startIndex = (page - 1) * limit;
      const paginated = populated.slice(startIndex, startIndex + Number(limit));

      return res.json({
        success: true,
        jobs: paginated,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      });
    }

    // Live MongoDB Query
    const query = { status: 'active' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (category && category !== 'All') query.category = category;
    if (jobType && jobType !== 'All') query.jobType = jobType;
    if (workplaceType && workplaceType !== 'All') query.workplaceType = workplaceType;
    if (experienceLevel && experienceLevel !== 'All') query.experienceLevel = experienceLevel;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('companyId', 'name logo location industry size tagline')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    let bookmarkedJobIds = [];
    if (req.user) {
      const bookmarks = await Bookmark.find({ candidateId: req.user._id });
      bookmarkedJobIds = bookmarks.map(b => b.jobId.toString());
    }

    const formattedJobs = jobs.map(job => ({
      ...job.toObject(),
      company: job.companyId,
      isBookmarked: bookmarkedJobIds.includes(job._id.toString())
    }));

    return res.json({
      success: true,
      jobs: formattedJobs,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { useMock } = getDbState();

    if (useMock) {
      const job = mockStore.findJobById(id);
      if (!job) return res.status(404).json({ success: false, message: 'Job posting not found' });

      // Increment view count
      job.views = (job.views || 0) + 1;

      const company = mockStore.findCompanyById(job.companyId) || {
        name: 'Tech Ventures',
        logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
        about: 'Leading technology provider empowering innovators worldwide.',
        website: 'https://example.com',
        location: job.location,
        size: '100-500 employees'
      };

      const isBookmarked = req.user ? mockStore.isBookmarked(req.user._id, job._id) : false;

      // Find similar jobs
      const similarJobs = mockStore.jobs
        .filter(j => j._id.toString() !== id.toString() && j.category === job.category)
        .slice(0, 3)
        .map(j => ({
          ...j,
          company: mockStore.findCompanyById(j.companyId) || { name: 'Acme Corp' }
        }));

      return res.json({
        success: true,
        job: { ...job, company, isBookmarked },
        similarJobs
      });
    }

    // MongoDB Mode
    const job = await Job.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
      .populate('companyId')
      .populate('recruiterId', 'name email avatar');

    if (!job) return res.status(404).json({ success: false, message: 'Job posting not found' });

    let isBookmarked = false;
    if (req.user) {
      const bm = await Bookmark.findOne({ candidateId: req.user._id, jobId: id });
      isBookmarked = !!bm;
    }

    const similarJobs = await Job.find({ _id: { $ne: id }, category: job.category })
      .populate('companyId', 'name logo location')
      .limit(3);

    return res.json({
      success: true,
      job: { ...job.toObject(), company: job.companyId, isBookmarked },
      similarJobs
    });
  } catch (error) {
    next(error);
  }
};

exports.createJob = async (req, res, next) => {
  try {
    const { 
      title, category, jobType, workplaceType, experienceLevel, 
      location, salaryRange, description, responsibilities, requirements, benefits, skills 
    } = req.body;

    if (!title || !category || !location || !salaryRange || !description) {
      return res.status(400).json({ success: false, message: 'Please provide all required job fields' });
    }

    const { useMock } = getDbState();

    if (useMock) {
      let company = mockStore.findCompanyByRecruiter(req.user._id);
      if (!company) {
        company = mockStore.addCompany({
          name: `${req.user.name}'s Organization`,
          recruiterId: req.user._id,
          location
        });
      }

      const newJob = mockStore.addJob({
        title,
        recruiterId: req.user._id,
        companyId: company._id,
        category,
        jobType: jobType || 'Full Time',
        workplaceType: workplaceType || 'Remote',
        experienceLevel: experienceLevel || 'Mid Level',
        location,
        salaryRange,
        description,
        responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n') : []),
        requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split('\n') : []),
        benefits: Array.isArray(benefits) ? benefits : (benefits ? benefits.split('\n') : []),
        skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : [])
      });

      return res.status(201).json({ success: true, message: 'Job posting published successfully', job: newJob });
    }

    // Mongo Mode
    let company = await Company.findOne({ recruiterId: req.user._id });
    if (!company) {
      company = await Company.create({
        name: `${req.user.name}'s Organization`,
        recruiterId: req.user._id,
        location
      });
    }

    const newJob = await Job.create({
      title,
      recruiterId: req.user._id,
      companyId: company._id,
      category,
      jobType,
      workplaceType,
      experienceLevel,
      location,
      salaryRange,
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n') : []),
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split('\n') : []),
      benefits: Array.isArray(benefits) ? benefits : (benefits ? benefits.split('\n') : []),
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : [])
    });

    return res.status(201).json({ success: true, message: 'Job posting published successfully', job: newJob });
  } catch (error) {
    next(error);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { useMock } = getDbState();

    if (useMock) {
      const updated = mockStore.updateJob(id, req.body);
      return res.json({ success: true, message: 'Job posting updated', job: updated });
    }

    const updated = await Job.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({ success: true, message: 'Job posting updated', job: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { useMock } = getDbState();

    if (useMock) {
      mockStore.deleteJob(id);
      return res.json({ success: true, message: 'Job posting deleted' });
    }

    await Job.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Job posting deleted' });
  } catch (error) {
    next(error);
  }
};

exports.toggleBookmark = async (req, res, next) => {
  try {
    const { id } = req.params; // jobId
    const { useMock } = getDbState();

    if (useMock) {
      const isSaved = mockStore.toggleBookmark(req.user._id, id);
      return res.json({
        success: true,
        isBookmarked: isSaved,
        message: isSaved ? 'Job saved to bookmarks' : 'Job removed from bookmarks'
      });
    }

    const existing = await Bookmark.findOne({ candidateId: req.user._id, jobId: id });
    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return res.json({ success: true, isBookmarked: false, message: 'Job removed from bookmarks' });
    } else {
      await Bookmark.create({ candidateId: req.user._id, jobId: id });
      return res.json({ success: true, isBookmarked: true, message: 'Job saved to bookmarks' });
    }
  } catch (error) {
    next(error);
  }
};

exports.getSavedJobs = async (req, res, next) => {
  try {
    const { useMock } = getDbState();

    if (useMock) {
      const userBookmarks = mockStore.bookmarks.filter(b => b.candidateId.toString() === req.user._id.toString());
      const savedJobs = userBookmarks
        .map(b => mockStore.findJobById(b.jobId))
        .filter(Boolean)
        .map(job => ({
          ...job,
          company: mockStore.findCompanyById(job.companyId) || { name: 'Acme Corp' },
          isBookmarked: true
        }));

      return res.json({ success: true, jobs: savedJobs });
    }

    const bookmarks = await Bookmark.find({ candidateId: req.user._id }).populate({
      path: 'jobId',
      populate: { path: 'companyId' }
    });

    const savedJobs = bookmarks
      .filter(b => b.jobId)
      .map(b => ({
        ...b.jobId.toObject(),
        company: b.jobId.companyId,
        isBookmarked: true
      }));

    return res.json({ success: true, jobs: savedJobs });
  } catch (error) {
    next(error);
  }
};
