const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/stats', authenticate, authorize('admin'), adminController.getAdminStats);
router.get('/users', authenticate, authorize('admin'), adminController.getUsers);
router.put('/users/:id/toggle-status', authenticate, authorize('admin'), adminController.toggleUserStatus);
router.put('/companies/:companyId/approve', authenticate, authorize('admin'), adminController.approveRecruiter);

module.exports = router;
