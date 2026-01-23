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
const router = express.Router();

// User routes
router.post('/', protect, createOrder);                    // Create order (auth required)
router.get('/my', protect, getMyOrders);                   // Get logged-in user's orders
router.post('/generate-invoice', protect, generateInvoice); // Generate & send invoice
router.get('/:orderId/download-invoice', protect, downloadInvoice); // Download invoice PDF

// Admin/general routes
router.get('/', protect, getAllOrders);        // Get all orders
router.get('/:id', protect, getOrderById);     // Get order by ID (auth required)
router.put('/:id', protect, updateOrder);      // Update order by ID
router.delete('/:id', protect, deleteOrder);   // Delete order by ID

module.exports = router;
