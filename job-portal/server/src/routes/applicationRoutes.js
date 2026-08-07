const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/apply', authenticate, authorize('candidate'), applicationController.applyJob);
router.get('/my-applications', authenticate, authorize('candidate'), applicationController.getCandidateApplications);
router.get('/job/:jobId', authenticate, authorize('recruiter', 'admin'), applicationController.getJobApplications);
router.put('/:id/status', authenticate, authorize('recruiter', 'admin'), applicationController.updateApplicationStatus);

module.exports = router;
