const express = require("express");
const router = express.Router();
const adminProtect = require("../../middlewares/adminProtect");

const {
  getBannersByLocation,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
} = require("../controllers/bannerController");

// Public routes
router.get("/:location", getBannersByLocation);

// Admin routes (protected)
router.get("/admin/all", adminProtect, getAllBanners);
router.post("/", adminProtect, createBanner);
router.put("/:id", adminProtect, updateBanner);
router.delete("/:id", adminProtect, deleteBanner);
router.patch("/:id/toggle", adminProtect, toggleBannerStatus);

module.exports = router;
