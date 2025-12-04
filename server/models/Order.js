const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = new mongoose.Schema({
  orderId: { type: Number, unique: true },

  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },

  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // single reference to your unified Product model
        required: true,
      },
      quantity: { type: Number, required: true },
      name: { type: String, required: true }, // store product name snapshot
      price: { type: Number, required: true }, // store sale/regular price snapshot
    },
  ],
  
  subtotal: { type: Number, required: true },         // <-- ADD
  deliveryCharge: { type: Number, default: 0 },      // <-- ADD
  totalAmount: { type: Number, required: true },

  paymentMethod: {
    type: String,
    enum: ["cashOnDelivery","onlinePayment", "creditCard", "debitCard", "netBanking"],
    required: true,
  },

  porterOrderId: { type: String },
  note: { type: String },

  isViewed: { type: Boolean, default: false },

  status: {
    type: String,
    enum: [
      "pending payment",
      "processing",
      "on hold",
      "completed",
      "refunded",
      "cancelled",
      "failed",
    ],
    default: "pending payment",
  },

  createdAt: { type: Date, default: Date.now },
});

// Auto-increment orderId
orderSchema.plugin(AutoIncrement, { inc_field: "orderId" });

module.exports = mongoose.model("Order", orderSchema);
