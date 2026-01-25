const express = require("express");
const { upload, handleMulterError } = require("../../middlewares/upload");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const adminProtect = require("../../middlewares/adminProtect");

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin routes (protected)
router.post(
  "/",
  adminProtect,
  upload.array("images", 5),
  handleMulterError,
  createProduct
);

router.put(
  "/:id",
  adminProtect,
  upload.array("images", 5),
  handleMulterError,
  updateProduct
);

router.delete("/:id", adminProtect, deleteProduct);

module.exports = router;
