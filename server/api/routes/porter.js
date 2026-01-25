const express = require('express');
const router = express.Router();
const adminProtect = require('../../middlewares/adminProtect');
const { createOrder, cancelOrder } = require('../controllers/porterController');

// Admin routes - create and manage Porter deliveries
router.post('/create', adminProtect, createOrder);
router.post('/:crn/cancel', adminProtect, cancelOrder);

module.exports = router;
