const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  category: { type: String, required: true },
  jobType: { type: String, enum: ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'], default: 'Full Time' },
  workplaceType: { type: String, enum: ['Remote', 'Hybrid', 'On-site'], default: 'Remote' },
  experienceLevel: { type: String, enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead / Executive'], default: 'Mid Level' },
  location: { type: String, required: true },
  salaryRange: { type: String, required: true },
  minSalary: { type: Number, default: 0 },
  maxSalary: { type: Number, default: 0 },
  description: { type: String, required: true },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  benefits: [{ type: String }],
  skills: [{ type: String }],
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  views: { type: Number, default: 0 },
  applicationsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
