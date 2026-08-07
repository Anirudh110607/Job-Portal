const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  logo: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  tagline: { type: String, default: '' },
  about: { type: String, default: '' },
  website: { type: String, default: '' },
  industry: { type: String, default: 'Technology' },
  size: { type: String, default: '50-200 employees' },
  location: { type: String, default: '' },
  isApproved: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
