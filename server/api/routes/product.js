const express = require("express");
const { upload, handleMulterError } = require("../../middlewares/upload"); // ✅ updated import
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const protect = require("../../middlewares/protect"); // Importing the protect middleware

const router = express.Router();

// ✅ Create new product (max 5 images, handle file size or type errors)
router.post(
  "/",
  protect,
  upload.array("images", 5),
  handleMulterError, // <-- added here
  createProduct
);

// ✅ Get all products
router.get("/", getProducts);

// ✅ Get product by ID
router.get("/:id", getProductById);

// ✅ Update product (max 5 images, handle multer errors)
router.put(
  "/:id",
  protect,
  upload.array("images", 5),
  handleMulterError, // <-- added here
  updateProduct
);

// ✅ Delete product by ID
router.delete("/:id", protect, deleteProduct);

module.exports = router;
