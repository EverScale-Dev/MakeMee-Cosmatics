const express = require('express');
const router = express.Router();
const { createOrder, cancelOrder } = require('../controllers/porterController');

// Define the route for creating an order
router.post('/create', createOrder);
router.post('/:crn/cancel', cancelOrder);

module.exports = router;
