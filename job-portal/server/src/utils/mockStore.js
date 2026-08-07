// In-memory data store for fallback operation when MongoDB is not running locally
const crypto = require('crypto');

class MockStore {
  constructor() {
    this.users = [];
    this.companies = [];
    this.jobs = [];
    this.applications = [];
    this.interviews = [];
    this.notifications = [];
    this.bookmarks = [];
    this.categories = [];
    this.reports = [];
  }

  generateId() {
    return crypto.randomBytes(12).toString('hex');
  }

  // Users
  addUser(userData) {
    const user = {
      _id: this.generateId(),
      role: 'candidate',
      status: 'active',
      bio: '',
      skills: [],
      experience: [],
      education: [],
      certifications: [],
      projects: [],
      languages: [],
      portfolio: '',
      linkedin: '',
      github: '',
      location: '',
      availability: 'Immediate',
      createdAt: new Date().toISOString(),
      ...userData
    };
    this.users.push(user);
    return user;
  }

  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u._id.toString() === id.toString());
  }

  updateUser(id, updates) {
    const idx = this.users.findIndex(u => u._id.toString() === id.toString());
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updates, updatedAt: new Date().toISOString() };
      return this.users[idx];
    }
    return null;
  }

  // Companies
  addCompany(companyData) {
    const company = {
      _id: this.generateId(),
      isApproved: true,
      size: '50-200 employees',
      industry: 'Technology',
      location: 'San Francisco, CA',
      createdAt: new Date().toISOString(),
      ...companyData
    };
    this.companies.push(company);
    return company;
  }

  findCompanyById(id) {
    return this.companies.find(c => c._id.toString() === id.toString());
  }

  findCompanyByRecruiter(recruiterId) {
    return this.companies.find(c => c.recruiterId.toString() === recruiterId.toString());
  }

  // Jobs
  addJob(jobData) {
    const job = {
      _id: this.generateId(),
      status: 'active',
      views: 0,
      applicationsCount: 0,
      jobType: 'Full Time',
      experienceLevel: 'Mid Level',
      workplaceType: 'Remote',
      salaryRange: '$90,000 - $120,000',
      createdAt: new Date().toISOString(),
      ...jobData
    };
    this.jobs.push(job);
    return job;
  }

  findJobById(id) {
    return this.jobs.find(j => j._id.toString() === id.toString());
  }

  updateJob(id, updates) {
    const idx = this.jobs.findIndex(j => j._id.toString() === id.toString());
    if (idx !== -1) {
      this.jobs[idx] = { ...this.jobs[idx], ...updates, updatedAt: new Date().toISOString() };
      return this.jobs[idx];
    }
    return null;
  }

  deleteJob(id) {
    this.jobs = this.jobs.filter(j => j._id.toString() !== id.toString());
  }

  // Applications
  addApplication(appData) {
    const app = {
      _id: this.generateId(),
      status: 'applied', // applied, shortlisted, interview, hired, rejected
      matchPercentage: Math.floor(Math.random() * 25) + 75, // 75% - 99%
      appliedAt: new Date().toISOString(),
      ...appData
    };
    this.applications.push(app);

    // Update job applications count
    const job = this.findJobById(appData.jobId);
    if (job) {
      job.applicationsCount = (job.applicationsCount || 0) + 1;
    }

    return app;
  }

  findApplication(jobId, candidateId) {
    return this.applications.find(a => 
      a.jobId.toString() === jobId.toString() && 
      a.candidateId.toString() === candidateId.toString()
    );
  }

  updateApplication(id, updates) {
    const idx = this.applications.findIndex(a => a._id.toString() === id.toString());
    if (idx !== -1) {
      this.applications[idx] = { ...this.applications[idx], ...updates, updatedAt: new Date().toISOString() };
      return this.applications[idx];
    }
    return null;
  }

  // Interviews
  addInterview(interviewData) {
    const interview = {
      _id: this.generateId(),
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      ...interviewData
    };
    this.interviews.push(interview);
    return interview;
  }

  // Bookmarks
  toggleBookmark(candidateId, jobId) {
    const idx = this.bookmarks.findIndex(b => 
      b.candidateId.toString() === candidateId.toString() && 
      b.jobId.toString() === jobId.toString()
    );

    if (idx !== -1) {
      this.bookmarks.splice(idx, 1);
      return false; // Removed
    } else {
      this.bookmarks.push({
        _id: this.generateId(),
        candidateId,
        jobId,
        createdAt: new Date().toISOString()
      });
      return true; // Added
    }
  }

  isBookmarked(candidateId, jobId) {
    return this.bookmarks.some(b => 
      b.candidateId.toString() === candidateId.toString() && 
      b.jobId.toString() === jobId.toString()
    );
  }

  // Notifications
  addNotification(notifData) {
    const notif = {
      _id: this.generateId(),
      read: false,
      createdAt: new Date().toISOString(),
      ...notifData
    };
    this.notifications.push(notif);
    return notif;
  }
}

const mockStore = new MockStore();
module.exports = mockStore;
