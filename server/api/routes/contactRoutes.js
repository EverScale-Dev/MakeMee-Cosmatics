const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  contactForm,
  getAllSubmissions,
  markAsRead,
  deleteSubmission,
  getUnreadCount
} = require('../controllers/contactController');
const protect = require('../../middlewares/protect');
const adminProtect = require('../../middlewares/adminProtect');

const router = express.Router();

// Rate limit for contact form - 5 submissions per hour
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: 'Too many submissions. Please try again later.' }
});

// Public route
router.post('/', contactLimiter, contactForm);

// Admin routes
router.get('/', protect, adminProtect, getAllSubmissions);
router.get('/unread-count', protect, adminProtect, getUnreadCount);
router.patch('/:id/read', protect, adminProtect, markAsRead);
router.delete('/:id', protect, adminProtect, deleteSubmission);

module.exports = router;
