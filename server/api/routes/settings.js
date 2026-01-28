const express = require("express");
const router = express.Router();
const {
  getAllSettings,
  getSetting,
  updateSetting,
  updateSettings,
  getPublicSettings,
  getAdminPermissions,
  updateAdminPermissions,
} = require("../controllers/settingsController");
const protect = require("../../middlewares/protect");
const adminProtect = require("../../middlewares/adminProtect");
const superAdminProtect = require("../../middlewares/superAdminProtect");

// Public settings (no auth required)
router.get("/public", getPublicSettings);

// Admin permissions (GET: any admin, PUT: super_admin only)
router.get("/admin-permissions", adminProtect, getAdminPermissions);
router.put("/admin-permissions", superAdminProtect, updateAdminPermissions);

// Admin routes (require authentication)
router.get("/", adminProtect, getAllSettings);
router.get("/:key", adminProtect, getSetting);
router.put("/:key", adminProtect, updateSetting);
router.put("/", adminProtect, updateSettings);

module.exports = router;
