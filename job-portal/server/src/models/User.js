const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['candidate', 'recruiter', 'admin'], default: 'candidate' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  availability: { type: String, default: 'Immediate' },
  skills: [{ type: String }],
  resumeUrl: { type: String, default: '' },
  portfolio: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  experience: [{
    title: String,
    company: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String
  }],
  education: [{
    degree: String,
    institution: String,
    fieldOfStudy: String,
    startYear: String,
    endYear: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    year: String
  }],
  projects: [{
    title: String,
    description: String,
    link: String
  }],
  languages: [{ type: String }],
  isVerified: { type: Boolean, default: true },
  status: { type: String, enum: ['active', 'banned'], default: 'active' },
  refreshToken: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
