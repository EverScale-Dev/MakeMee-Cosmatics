const express = require('express');
const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController'); // Importing the controller
const protect = require('../../middlewares/protect'); // Importing the protect middleware

const router = express.Router();

// Routes for customer CRUD operations
router.post('/', createCustomer);                // Create a new customer
router.get('/', protect ,getAllCustomers);                // Get all customers
router.get('/:id', protect, getCustomerById);             // Get a specific customer by ID
router.put('/:id', protect, updateCustomer);              // Update a customer by ID
router.delete('/:id', protect, deleteCustomer);           // Delete a customer by ID


module.exports = router;
