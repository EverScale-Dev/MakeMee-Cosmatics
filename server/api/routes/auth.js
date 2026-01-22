const express = require('express');
const {
  register,
  login,
  completeRegistration,
  forgotPassword,
  resetPassword,
  googleAuth,
  registerUser,
  userLogin,
  adminLogin,
  getProfile,
  updateProfile,
  sendOtp,
  verifyOtp,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require('../controllers/authController');
const protect = require('../../middlewares/protect');

const router = express.Router();

// User auth routes
router.post('/register', register);                    // Legacy: Admin registration
router.post('/register-user', registerUser);           // User registration with password
router.post('/login', login);                          // Legacy: Login
router.post('/user-login', userLogin);                 // User login
router.post('/admin-login', adminLogin);               // Admin login (separate)
router.post('/complete-registration', completeRegistration);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google', googleAuth);                    // Google OAuth login

// Protected user routes
router.get('/me', protect, getProfile);                // Get user profile
router.put('/me', protect, updateProfile);             // Update user profile

// Phone verification (OTP)
router.post('/send-otp', protect, sendOtp);            // Send OTP to phone
router.post('/verify-otp', protect, verifyOtp);        // Verify OTP

// Address management
router.post('/addresses', protect, addAddress);                    // Add new address
router.put('/addresses/:addressId', protect, updateAddress);       // Update address
router.delete('/addresses/:addressId', protect, deleteAddress);    // Delete address
router.put('/addresses/:addressId/default', protect, setDefaultAddress); // Set default

module.exports = router;
