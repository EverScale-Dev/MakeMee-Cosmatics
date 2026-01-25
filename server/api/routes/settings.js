const express = require("express");
const router = express.Router();
const {
  getAllSettings,
  getSetting,
  updateSetting,
  updateSettings,
  getPublicSettings,
} = require("../controllers/settingsController");
const { protect, admin } = require("../middleware/auth");

// Public settings (no auth required)
router.get("/public", getPublicSettings);

// Admin routes (require authentication)
router.get("/", protect, admin, getAllSettings);
router.get("/:key", protect, admin, getSetting);
router.put("/:key", protect, admin, updateSetting);
router.put("/", protect, admin, updateSettings);

module.exports = router;
