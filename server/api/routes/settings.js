const express = require("express");
const router = express.Router();
const {
  getAllSettings,
  getSetting,
  updateSetting,
  updateSettings,
  getPublicSettings,
} = require("../controllers/settingsController");
const protect = require("../../middlewares/protect");
const adminProtect = require("../../middlewares/adminProtect");

// Public settings (no auth required)
router.get("/public", getPublicSettings);

// Admin routes (require authentication)
router.get("/", adminProtect, getAllSettings);
router.get("/:key", adminProtect, getSetting);
router.put("/:key", adminProtect, updateSetting);
router.put("/", adminProtect, updateSettings);

module.exports = router;
