const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = new mongoose.Schema({
  orderId: { type: Number, unique: true },

  // Link to logged-in user (for order history)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  // Link to customer (shipping info)
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
  
  subtotal: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },

  // Coupon/discount fields
  couponCode: { type: String, default: null },
  couponDiscount: { type: Number, default: 0 },

  totalAmount: { type: Number, required: true },

  paymentMethod: {
    type: String,
    enum: ["cashOnDelivery","onlinePayment", "creditCard", "debitCard", "netBanking"],
    required: true,
  },

  // Payment status tracking (critical for online payments)
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },

  // Razorpay payment details (only for online payments)
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },

  porterOrderId: { type: String },
  note: { type: String },

  isViewed: { type: Boolean, default: false },
  invoiceSent: { type: Boolean, default: false },

  // Shiprocket shipment data
  shiprocket: {
    orderId: { type: String },           // Shiprocket order ID
    shipmentId: { type: String },        // Shiprocket shipment ID
    awb: { type: String },               // Air Way Bill tracking number
    courierName: { type: String },       // Courier company name
    courierCompanyId: { type: Number },  // Courier company ID
    trackingUrl: { type: String },       // Live tracking URL
    labelUrl: { type: String },          // Shipping label PDF URL
    pickupLocation: { type: String },    // Pickup warehouse location
    shipmentStatus: { type: String },    // Current shipment status from Shiprocket
    createdAt: { type: Date },           // When shipment was created
    // Internal status tracking
    status: {
      type: String,
      enum: ["pending_awb", "ready", "pickup_scheduled", "shipped", "delivered", "cancelled"],
      default: "pending_awb"
    },
    awbError: { type: String },          // Error message if AWB assignment failed
    awbErrorCode: { type: String },      // Error code (UNAUTHORIZED, COD_NOT_ENABLED, etc.)
    awbRetryCount: { type: Number, default: 0 }, // Number of AWB retry attempts
    lastAwbAttempt: { type: Date },      // Last AWB assignment attempt time
  },

  status: {
    type: String,
    enum: [
      "pending payment",
      "processing",
      "on hold",
      "shipped",
      "in transit",
      "out for delivery",
      "delivered",
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
