const express = require("express");
const router = express.Router();
const protect = require("../../middlewares/protect");
const {
  shipOrder,
  assignAwbToOrder,
  generateLabelForOrder,
  trackOrderById,
  trackByAwbNumber,
  getShipmentStatus,
} = require("../controllers/shiprocketController");

// Create shipment for an order
// POST /api/shiprocket/ship/:id
router.post("/ship/:id", protect, shipOrder);

// Assign AWB to existing shipment (retry)
// POST /api/shiprocket/assign-awb/:id
router.post("/assign-awb/:id", protect, assignAwbToOrder);

// Generate shipping label for an order
// POST /api/shiprocket/generate-label/:id
router.post("/generate-label/:id", protect, generateLabelForOrder);

// Track shipment by order ID (MongoDB _id or orderId number)
// GET /api/shiprocket/track/:orderId
router.get("/track/:orderId", trackOrderById);

// Track shipment by AWB number directly
// GET /api/shiprocket/track/awb/:awb
router.get("/track/awb/:awb", trackByAwbNumber);

// Get shipment status for an order
// GET /api/shiprocket/status/:id
router.get("/status/:id", getShipmentStatus);

module.exports = router;
