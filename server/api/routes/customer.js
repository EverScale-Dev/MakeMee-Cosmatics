const express = require('express');
const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');
const adminProtect = require('../../middlewares/adminProtect');

const router = express.Router();

// Public route - create customer during checkout
router.post('/', createCustomer);

// Admin routes (admin only)
router.get('/', adminProtect, getAllCustomers);
router.get('/:id', adminProtect, getCustomerById);
router.put('/:id', adminProtect, updateCustomer);
router.delete('/:id', adminProtect, deleteCustomer);

module.exports = router;
