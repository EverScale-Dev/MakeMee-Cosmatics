const express = require("express");
const router = express.Router();
const adminProtect = require("../../middlewares/adminProtect");

const {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");

// Public route - validate coupon at checkout
router.post("/validate", validateCoupon);

// Admin routes (admin only)
router.get("/", adminProtect, getAllCoupons);
router.post("/", adminProtect, createCoupon);
router.put("/:id", adminProtect, updateCoupon);
router.delete("/:id", adminProtect, deleteCoupon);

module.exports = router;
