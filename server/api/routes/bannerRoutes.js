const express = require("express");
const router = express.Router();

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

// Admin routes
router.get("/admin/all", getAllBanners);
router.post("/", createBanner);
router.put("/:id", updateBanner);
router.delete("/:id", deleteBanner);
router.patch("/:id/toggle", toggleBannerStatus);

module.exports = router;
