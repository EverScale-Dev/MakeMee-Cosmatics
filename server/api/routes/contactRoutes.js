const express = require('express');
const { contactForm } = require('../controllers/contactController');

const router = express.Router();

// POST /contact
router.post('/', contactForm);

module.exports = router;
