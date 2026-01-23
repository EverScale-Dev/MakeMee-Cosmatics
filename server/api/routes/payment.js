const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const Order = require("../../models/Order");
const dotenv = require("dotenv");

const router = express.Router();
dotenv.config();

// Rate limiting for payment endpoints
const paymentLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: { success: false, message: 'Too many payment requests. Please try again later.' },
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/razorpay/order", paymentLimiter, async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    const options = {
      amount,
      currency,
      receipt,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    // console.log("✅ Razorpay order created:", order);

    res.status(200).json({
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID, // frontend needs this
    });
  } catch (err) {
    console.error("❌ Error creating Razorpay order:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Verify Razorpay payment
router.post("/razorpay/verify", paymentLimiter, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = generatedSignature === razorpay_signature;

    // Log verification attempt (without exposing signatures)
    if (process.env.NODE_ENV !== 'production') {
      console.log("🔍 Payment verification attempt for order:", orderId);
    }

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Signature mismatch" });
    }

    // Update order status
    await Order.findByIdAndUpdate(orderId, {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      isPaid: true,
      status: "completed", // set status to completed
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Payment verification failed:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


router.get("/order-status/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId); 
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Order status fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch order status" });
  }
});

module.exports = router;
