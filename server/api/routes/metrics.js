const express = require('express');
const { getMetrics, getChartData } = require('../controllers/metricsController');
const protect = require('../../middlewares/protect');

const router = express.Router();

// @route   GET /api/metrics
// @desc    Get dashboard metrics
router.get('/', protect, getMetrics);

// @route   GET /api/metrics/charts
// @desc    Get chart data (sales by month, orders by status)
router.get('/charts', protect, getChartData);

module.exports = router;
