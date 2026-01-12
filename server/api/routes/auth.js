const express = require('express');
const { register, login, completeRegistration, forgotPassword, resetPassword, googleAuth } = require('../controllers/authController');
const router = express.Router();

// Auth routes
router.post('/register', register);        // Register a new customer
router.post('/login', login);              // Login customer
router.post('/complete-registration', completeRegistration);              // complete-registration
router.post('/forgot-password', forgotPassword); // Forgot password
router.post('/reset-password', resetPassword); // Reset password
router.post('/google', googleAuth); // Google OAuth login

module.exports = router;
