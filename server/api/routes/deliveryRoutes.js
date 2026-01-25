const express = require("express");
const router = express.Router();
const adminProtect = require("../../middlewares/adminProtect");

const {
  getDeliverySettings,
  updateDeliverySettings,
} = require("../controllers/deliveryController");

// Public - get delivery charges
router.get("/", getDeliverySettings);

// Admin only - update delivery settings
router.post("/", adminProtect, updateDeliverySettings);

module.exports = router;
