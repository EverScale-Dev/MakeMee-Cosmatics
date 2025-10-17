const express = require('express');
const router = express.Router();
const {
  shipOrder,
  trackOrder
} = require('../controllers/shiprocketController');

// Route: POST /api/shiprocket/ship/:id
router.post('/ship/:id', shipOrder);

// Route: GET /api/shiprocket/track/:awb
router.get('/track/:awb', trackOrder);

module.exports = router;
