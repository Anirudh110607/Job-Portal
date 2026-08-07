const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['applied', 'shortlisted', 'interview', 'hired', 'rejected'], 
    default: 'applied' 
  },
  matchPercentage: { type: Number, default: 85 },
  recruiterNotes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
