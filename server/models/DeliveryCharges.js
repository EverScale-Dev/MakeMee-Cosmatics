const mongoose = require("mongoose");

const DeliveryChargesSchema = new mongoose.Schema({
  freeDeliveryAbove: { type: Number, default: 0 },
  baseDeliveryCharge: { type: Number, default: 49 },
  extraCharge: { type: Number, default: 25 },
  active: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.DeliveryCharges || mongoose.model("DeliveryCharges", DeliveryChargesSchema);
