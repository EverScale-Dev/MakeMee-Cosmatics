const express = require('express');
const { getCart, mergeCart, syncCart, updateCart } = require('../controllers/cartController');
const protect = require('../../middlewares/protect');

const router = express.Router();

// All cart routes require authentication
router.get('/', protect, getCart);
router.post('/merge', protect, mergeCart);
router.post('/sync', protect, syncCart);
router.post('/update', protect, updateCart);

module.exports = router;
