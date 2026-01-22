const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  shippingAddress: {
    apartment_address: String,
    street_address1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    lat: { type: Number }, // Optional - not required by Shiprocket
    lng: { type: Number }, // Optional - not required by Shiprocket
    pincode: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Customer", customerSchema);
