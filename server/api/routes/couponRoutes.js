const express = require("express");
const router = express.Router();
const adminProtect = require("../../middlewares/adminProtect");

const {
  validateCoupon,
  getAllCoupons,
  getVisibleCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");

// Public routes
router.post("/validate", validateCoupon);
router.get("/visible", getVisibleCoupons); // Get coupons visible to customers

// Admin routes (admin only)
router.get("/", adminProtect, getAllCoupons);
router.post("/", adminProtect, createCoupon);
router.put("/:id", adminProtect, updateCoupon);
router.delete("/:id", adminProtect, deleteCoupon);

module.exports = router;
