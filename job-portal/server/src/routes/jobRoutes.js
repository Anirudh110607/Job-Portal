const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticate, authorize } = require('../middleware/auth');

// Optional auth wrapper for getJobs so bookmarked status is populated if logged in
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, jobController.getJobs);
router.get('/saved', authenticate, authorize('candidate'), jobController.getSavedJobs);
router.get('/:id', optionalAuth, jobController.getJobById);
router.post('/', authenticate, authorize('recruiter', 'admin'), jobController.createJob);
router.put('/:id', authenticate, authorize('recruiter', 'admin'), jobController.updateJob);
router.delete('/:id', authenticate, authorize('recruiter', 'admin'), jobController.deleteJob);
router.post('/:id/bookmark', authenticate, authorize('candidate'), jobController.toggleBookmark);

module.exports = router;
