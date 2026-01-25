const express = require('express');
const { getMetrics, getChartData } = require('../controllers/metricsController');
const adminProtect = require('../../middlewares/adminProtect');

const router = express.Router();

// @route   GET /api/metrics
// @desc    Get dashboard metrics (admin only)
router.get('/', adminProtect, getMetrics);

// @route   GET /api/metrics/charts
// @desc    Get chart data (sales by month, orders by status) (admin only)
router.get('/charts', adminProtect, getChartData);

module.exports = router;
