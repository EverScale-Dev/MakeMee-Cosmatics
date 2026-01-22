const express = require("express");
const router = express.Router();
const protect = require("../../middlewares/protect");

const {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");

// Public route - validate coupon
router.post("/validate", validateCoupon);

// Admin routes (protected)
router.get("/", protect, getAllCoupons);
router.post("/", protect, createCoupon);
router.put("/:id", protect, updateCoupon);
router.delete("/:id", protect, deleteCoupon);

module.exports = router;
