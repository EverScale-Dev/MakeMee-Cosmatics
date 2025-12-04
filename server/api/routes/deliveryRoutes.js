const express = require("express");
const router = express.Router();

const {
  getDeliverySettings,
  updateDeliverySettings,
} = require("../controllers/deliveryController"); // path must match your folder structure

router.get("/", getDeliverySettings);
router.post("/", updateDeliverySettings);

module.exports = router;
