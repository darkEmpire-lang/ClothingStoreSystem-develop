const express = require('express');
const router = express.Router();
const financialController = require('../Controllers/financialController');

// Get financial dashboard data
router.get('/financial-data', financialController.getFinancialData);

// Add new financial data
router.post('/financial-data', financialController.addFinancialData);

module.exports = router; 