const express = require('express');
const upload = require("../../middlewares/upload");
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const protect = require('../../middlewares/protect'); // Importing the protect middleware

const router = express.Router();

router.post('/', protect, upload.array("images", 5), createProduct); // Accept up to 5 images
router.get('/', getProducts);    // Get all products
router.get('/:id', getProductById);  // Get product by ID
router.put('/:id', protect, upload.array("images", 5), updateProduct);   // Update product by ID
router.delete('/:id', protect, deleteProduct);  // Delete product by ID

module.exports = router;
