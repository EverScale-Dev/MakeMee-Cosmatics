const express = require('express');
const { getMetrics } = require('../controllers/metricsController');
const protect = require('../../middlewares/protect'); // Importing the protect middleware


const router = express.Router();

// @route   GET /api/metrics
// @desc    Get dashboard metrics
router.get('/', protect, getMetrics);

module.exports = router;
