const express = require('express');
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getMyOrders
} = require('../controllers/orderController');

const { generateInvoice, downloadInvoice } = require('../controllers/invoiceController');

const protect = require('../../middlewares/protect');
const adminProtect = require('../../middlewares/adminProtect');
const router = express.Router();

// User routes (logged-in users)
router.post('/', protect, createOrder);                    // Create order
router.get('/my', protect, getMyOrders);                   // Get user's own orders
router.get('/:id', protect, getOrderById);                 // Get order by ID (controller checks ownership)
router.post('/generate-invoice', protect, generateInvoice); // Generate & send invoice
router.get('/:orderId/download-invoice', protect, downloadInvoice); // Download invoice PDF

// Admin routes (admin only)
router.get('/', adminProtect, getAllOrders);              // Get all orders
router.put('/:id', adminProtect, updateOrder);            // Update order status
router.delete('/:id', adminProtect, deleteOrder);         // Delete order

module.exports = router;
