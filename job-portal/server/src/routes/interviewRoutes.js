const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/schedule', authenticate, authorize('recruiter'), interviewController.scheduleInterview);
router.get('/', authenticate, interviewController.getInterviews);

module.exports = router;
