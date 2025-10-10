const express = require('express');
const { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder } = require('../controllers/orderController');
const protect = require('../../middlewares/protect'); 
const router = express.Router();

router.post('/', createOrder); // Create order
router.get('/', protect, getAllOrders);    // Get all orders
router.get('/:id', getOrderById);  // Get order by ID
router.put('/:id', protect, updateOrder);   // Update order by ID
router.delete('/:id', protect, deleteOrder);  // Delete order by ID

module.exports = router;
