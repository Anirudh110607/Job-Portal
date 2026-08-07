const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', companyController.getCompanies);
router.get('/:id', companyController.getCompanyById);
router.put('/profile', authenticate, authorize('recruiter'), companyController.updateCompany);

module.exports = router;
