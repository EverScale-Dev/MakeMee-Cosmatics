const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const Order = require("../../models/Order");
const Customer = require("../../models/Customer");
const Product = require("../../models/Product");
const User = require("../../models/User");
const Settings = require("../../models/Settings");
const { incrementCouponUsage } = require("../controllers/couponController");
const protect = require("../../middlewares/protect");
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

// In-memory store for pending payments (in production, use Redis)
// Key: razorpay_order_id, Value: order data
const pendingPayments = new Map();

// Cleanup old pending payments (older than 30 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of pendingPayments.entries()) {
    if (now - value.createdAt > 30 * 60 * 1000) {
      pendingPayments.delete(key);
    }
  }
}, 5 * 60 * 1000); // Run every 5 minutes

/**
 * POST /api/payment/razorpay/initiate
 * Initiate online payment - creates Razorpay order and stores pending order data
 * Order is NOT created until payment is verified
 */
router.post("/razorpay/initiate", protect, paymentLimiter, async (req, res) => {
  try {
    const {
      customer: customerData,
      products,
      subtotal,
      deliveryCharge,
      couponCode,
      couponDiscount,
      totalAmount,
      note,
    } = req.body;

    // Validate required fields
    if (!customerData || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: customer and products are required"
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid total amount"
      });
    }

    // Check phone verification if required
    const phoneVerificationRequired = await Settings.get("phoneVerificationRequired", false);
    if (phoneVerificationRequired && req.User?._id) {
      const user = await User.findById(req.User._id);
      if (!user?.phoneVerified) {
        return res.status(403).json({
          success: false,
          message: "Phone verification required to place an order",
          requiresPhoneVerification: true
        });
      }
    }

    // Validate customer exists
    const existingCustomer = await Customer.findById(customerData);
    if (!existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Customer does not exist"
      });
    }

    // Validate products and get prices from DB
    const validatedProducts = [];
    let calculatedSubtotal = 0;

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product} not found`
        });
      }

      // Get price from DB (security: never trust client price)
      let price = product.salePrice || product.regularPrice || 0;
      if (item.selectedSize?.ml && product.sizes?.length > 0) {
        const matchingSize = product.sizes.find(s => s.ml === item.selectedSize.ml);
        if (matchingSize) {
          price = matchingSize.sellingPrice || matchingSize.originalPrice || price;
        }
      }

      validatedProducts.push({
        product: item.product,
        quantity: item.quantity,
        name: product.name,
        price,
      });

      calculatedSubtotal += price * item.quantity;
    }

    // Validate delivery charge
    const validDeliveryCharge = Math.max(0, Math.min(Number(deliveryCharge) || 0, 500));
    const discount = Number(couponDiscount) || 0;
    const calculatedTotal = Math.max(0, calculatedSubtotal + validDeliveryCharge - discount);

    // Security check: total should roughly match (allow small rounding differences)
    if (Math.abs(calculatedTotal - totalAmount) > 1) {
      console.warn(`[Payment] Total mismatch: client=${totalAmount}, calculated=${calculatedTotal}`);
      // Use calculated total for security
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(calculatedTotal * 100), // Razorpay expects paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    });

    // Store pending order data
    pendingPayments.set(razorpayOrder.id, {
      userId: req.User._id,
      customerId: customerData,
      products: validatedProducts,
      subtotal: calculatedSubtotal,
      deliveryCharge: validDeliveryCharge,
      couponCode: couponCode || null,
      couponDiscount: discount,
      totalAmount: calculatedTotal,
      note: note || "",
      createdAt: Date.now(),
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Payment] Initiated payment: Razorpay order ${razorpayOrder.id}`);
    }

    res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: calculatedTotal,
    });

  } catch (err) {
    console.error("[Payment] Initiate error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to initiate payment"
    });
  }
});

/**
 * POST /api/payment/razorpay/verify
 * Verify payment and create order ONLY after successful verification
 */
router.post("/razorpay/verify", protect, paymentLimiter, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification data"
      });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = generatedSignature === razorpay_signature;

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Payment] Verification attempt: ${razorpay_order_id}, valid=${isValid}`);
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Invalid signature"
      });
    }

    // Get pending order data
    const pendingOrder = pendingPayments.get(razorpay_order_id);
    if (!pendingOrder) {
      return res.status(400).json({
        success: false,
        message: "Payment session expired or invalid. Please try again."
      });
    }

    // Security: Verify user matches
    if (pendingOrder.userId.toString() !== req.User._id.toString()) {
      console.error(`[Payment] User mismatch: pending=${pendingOrder.userId}, current=${req.User._id}`);
      return res.status(403).json({
        success: false,
        message: "Unauthorized payment verification"
      });
    }

    // CRITICAL: Create order ONLY after payment verification
    const order = await Order.create({
      user: pendingOrder.userId,
      customer: pendingOrder.customerId,
      products: pendingOrder.products,
      subtotal: pendingOrder.subtotal,
      deliveryCharge: pendingOrder.deliveryCharge,
      couponCode: pendingOrder.couponCode,
      couponDiscount: pendingOrder.couponDiscount,
      totalAmount: pendingOrder.totalAmount,
      paymentMethod: "onlinePayment",
      paymentStatus: "paid", // CRITICAL: Only set to paid after verification
      status: "processing",  // Ready to process (payment confirmed)
      note: pendingOrder.note,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    // Increment coupon usage if applicable
    if (pendingOrder.couponCode) {
      await incrementCouponUsage(pendingOrder.couponCode);
    }

    // Clean up pending payment
    pendingPayments.delete(razorpay_order_id);

    // Populate order for response
    const populatedOrder = await Order.findById(order._id)
      .populate("customer")
      .populate("products.product");

    console.log(`[Payment] Order ${order._id} created after successful payment verification`);

    res.status(200).json({
      success: true,
      message: "Payment verified and order created",
      order: populatedOrder,
    });

  } catch (err) {
    console.error("[Payment] Verification error:", err);
    res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });
  }
});

/**
 * DEPRECATED: Old order creation endpoint
 * Kept for backwards compatibility but no longer used for online payments
 */
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

    res.status(200).json({
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * GET /api/payment/order-status/:orderId
 * Get order status (for checking payment status)
 */
router.get("/order-status/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).select(
      "orderId status paymentStatus paymentMethod totalAmount createdAt"
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      orderId: order.orderId,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error("Order status fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch order status" });
  }
});

module.exports = router;
