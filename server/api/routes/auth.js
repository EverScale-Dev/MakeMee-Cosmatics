const express = require('express');
const rateLimit = require('express-rate-limit');
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
  deleteAccount,
} = require('../controllers/authController');
const protect = require('../../middlewares/protect');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window per IP
  message: { success: false, message: 'Too many attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 OTP requests per minute
  message: { success: false, message: 'Too many OTP requests. Please wait a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// User auth routes (rate limited)
router.post('/register', authLimiter, register);                    // Legacy: Admin registration
router.post('/register-user', authLimiter, registerUser);           // User registration with password
router.post('/login', authLimiter, login);                          // Legacy: Login
router.post('/user-login', authLimiter, userLogin);                 // User login
router.post('/admin-login', authLimiter, adminLogin);               // Admin login (separate)
router.post('/complete-registration', authLimiter, completeRegistration);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
router.post('/google', authLimiter, googleAuth);                    // Google OAuth login

// Protected user routes
router.get('/me', protect, getProfile);                // Get user profile
router.put('/me', protect, updateProfile);             // Update user profile

// Phone verification (OTP) - stricter rate limit
router.post('/send-otp', protect, otpLimiter, sendOtp);            // Send OTP to phone
router.post('/verify-otp', protect, otpLimiter, verifyOtp);        // Verify OTP

// Address management
router.post('/addresses', protect, addAddress);                    // Add new address
router.put('/addresses/:addressId', protect, updateAddress);       // Update address
router.delete('/addresses/:addressId', protect, deleteAddress);    // Delete address
router.put('/addresses/:addressId/default', protect, setDefaultAddress); // Set default

// Account deletion (soft delete)
router.delete('/account', protect, deleteAccount);                 // Delete user account

module.exports = router;
