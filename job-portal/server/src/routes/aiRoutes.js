const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticate } = require('../middleware/auth');

router.post('/analyze-resume', aiController.analyzeResume);
router.get('/recommendations', authenticate, aiController.getRecommendedJobs);

module.exports = router;
