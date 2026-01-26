const Order = require("../../models/Order");
const Product = require("../../models/Product");
const Customer = require("../../models/Customer");
const User = require("../../models/User");
const Settings = require("../../models/Settings");
const createInvoice = require("../../utils/createInvoice");
const sendEmail = require("../../utils/sendMail");
const { incrementCouponUsage } = require("./couponController");

// =========================================================
// @desc    Create a new order
// @route   POST /api/orders
// =========================================================

exports.createOrder = async (req, res) => {
  const { customer, products, totalAmount, paymentMethod, note, couponCode, couponDiscount } = req.body;

  try {
    // CRITICAL: Online payment orders MUST NOT be created directly
    // They must go through the payment verification flow
    // Only COD orders can be created directly
    if (paymentMethod === "onlinePayment") {
      // Check if this is an internal call from payment verification (has verified flag)
      if (!req._internalPaymentVerified) {
        return res.status(400).json({
          message: "Online payment orders must be created through the payment flow",
          code: "PAYMENT_REQUIRED"
        });
      }
    }

    // Check if phone verification is required (from admin settings)
    const phoneVerificationRequired = await Settings.get("phoneVerificationRequired", false);

    if (phoneVerificationRequired && req.User?._id) {
      const user = await User.findById(req.User._id);
      if (!user?.phoneVerified) {
        return res.status(403).json({
          message: "Phone verification required to place an order",
          requiresPhoneVerification: true
        });
      }
    }

    // ✅ Check if the customer exists
    const existingCustomer = await Customer.findById(customer);
    if (!existingCustomer) {
      return res.status(400).json({ message: "Customer does not exist" });
    }

    // ✅ Validate and format product data
    const validatedProducts = [];
    for (let item of products) {
      const productId = item.product;
      const existingProduct = await Product.findById(productId);

      if (!existingProduct) {
        return res.status(400).json({
          message: `Product with ID ${productId} does not exist`,
        });
      }

      // Determine price from product (not from client for security)
      // Priority: selectedSize price > product salePrice > product regularPrice > first size price
      let productPrice = 0;

      // First, try to get price from selected size
      if (item.selectedSize?.ml && existingProduct.sizes?.length > 0) {
        const matchingSize = existingProduct.sizes.find(s => s.ml === item.selectedSize.ml);
        if (matchingSize) {
          productPrice = matchingSize.sellingPrice || matchingSize.originalPrice || 0;
        }
      }

      // If no size price found, try root product prices
      if (!productPrice) {
        productPrice = existingProduct.salePrice || existingProduct.regularPrice || 0;
      }

      // If still no price and product has sizes, use first size's price
      if (!productPrice && existingProduct.sizes?.length > 0) {
        const firstSize = existingProduct.sizes[0];
        productPrice = firstSize.sellingPrice || firstSize.originalPrice || 0;
      }

      // Final validation - log warning if price is still 0
      if (!productPrice) {
        console.warn(`[Order] Product ${existingProduct.name} has no price set!`);
      }

      validatedProducts.push({
        product: productId,
        quantity: item.quantity,
        name: existingProduct.name,
        price: productPrice,
      });
    }

    // ✅ Create new order (minimal change: include subtotal & deliveryCharge)
    const subtotal = validatedProducts.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    // Validate delivery charge: must be non-negative and reasonable (max 500)
    const rawDeliveryCharge = Number(req.body.deliveryCharge) || 0;
    const deliveryCharge = Math.max(0, Math.min(rawDeliveryCharge, 500));
    const discount = Number(couponDiscount) || 0;

    // Calculate total: subtotal + delivery - discount
    // Discount can reduce below subtotal (e.g., 100% discount = just delivery charge)
    // Total can never go below 0
    const rawTotal = subtotal + deliveryCharge - discount;
    const finalTotal = Math.max(0, rawTotal);

    // Determine payment status based on payment method
    // COD orders: paymentStatus = "pending" (will be paid on delivery)
    // Online orders (coming through payment flow): paymentStatus = "paid"
    const paymentStatus = paymentMethod === "onlinePayment" ? "paid" : "pending";

    // Determine initial order status
    // COD orders: "pending payment" (misleading name, but keeping for compatibility)
    // Online paid orders: "processing" (payment confirmed, ready to process)
    const initialStatus = paymentMethod === "onlinePayment" ? "processing" : "pending payment";

    // ✅ Create new order (link to logged-in user if available)
    const order = await Order.create({
      user: req.User?._id,  // Link to logged-in user
      customer,
      products: validatedProducts,
      subtotal,
      deliveryCharge,
      couponCode: couponCode || null,
      couponDiscount: discount,
      totalAmount: finalTotal,
      paymentMethod,
      paymentStatus,
      status: initialStatus,
      note,
      // Include Razorpay details if provided (from payment verification flow)
      ...(req._razorpayDetails && {
        razorpayOrderId: req._razorpayDetails.razorpayOrderId,
        razorpayPaymentId: req._razorpayDetails.razorpayPaymentId,
      }),
    });

    // ✅ Increment coupon usage if a coupon was applied
    if (couponCode) {
      await incrementCouponUsage(couponCode);
    }

    // ✅ Populate for email & invoice
    const populatedOrder = await Order.findById(order._id)
      .populate("customer")
      .populate("products.product");

    // ✅ Send Response
    res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =========================================================
// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// =========================================================

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.User._id })
      .sort({ createdAt: -1 })
      .populate("customer", "fullName email phone shippingAddress")
      .populate("products.product");

    res.status(200).json({
      count: orders.length,
      orders: orders.map((order) => ({
        _id: order._id,
        orderId: order.orderId,
        customer: order.customer,
        products: order.products,
        subtotal: order.subtotal,
        deliveryCharge: order.deliveryCharge,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus || "pending",
        status: order.status,
        createdAt: order.createdAt,
        note: order.note,
      })),
    });
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================================================
// @desc    Get all orders (Paginated)
// @route   GET /api/orders
// =========================================================

exports.getAllOrders = async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("customer", "fullName email phone shippingAddress")
      .populate("products.product")
      .limit(Number(limit))
      .skip(Number(skip));

    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      totalOrders,
      orders: orders.map((order) => ({
        _id: order._id,
        orderId: order.orderId,
        customer: order.customer,
        products: order.products,
        subtotal: order.subtotal,
        deliveryCharge: order.deliveryCharge,
        couponCode: order.couponCode || null,
        couponDiscount: order.couponDiscount || 0,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus || "pending",
        status: order.status,
        shiprocket: order.shiprocket || null,
        createdAt: order.createdAt,
        note: order.note,
        isViewed: order.isViewed,
      })),
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================================================
// @desc    Get a single order by ID
// @route   GET /api/orders/:id
// =========================================================

exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    // Support both MongoDB _id and numeric orderId
    let order;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Valid MongoDB ObjectId format
      order = await Order.findById(id)
        .populate("customer", "fullName email phone shippingAddress")
        .populate("products.product");
    } else {
      // Try as numeric orderId
      order = await Order.findOne({ orderId: parseInt(id) })
        .populate("customer", "fullName email phone shippingAddress")
        .populate("products.product");
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Security: User can only view their own orders (admin can view any)
    const isOwner = order.user && order.user.toString() === req.User._id.toString();
    const isAdmin = req.User.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!order.isViewed) {
      order.isViewed = true;
      await order.save();
    }

    res.status(200).json({
      _id: order._id,
      orderId: order.orderId,
      customer: order.customer,
      products: order.products,
      subtotal: order.subtotal,
      deliveryCharge: order.deliveryCharge,
      couponCode: order.couponCode || null,
      couponDiscount: order.couponDiscount || 0,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus || "pending",
      status: order.status,
      shiprocket: order.shiprocket || null,
      createdAt: order.createdAt,
      note: order.note,
      isViewed: order.isViewed,
      razorpayOrderId: order.razorpayOrderId || null,
      razorpayPaymentId: order.razorpayPaymentId || null,
    });
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================================================
// @desc    Update an order status
// @route   PUT /api/orders/:id
// =========================================================

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "pending payment",
    "processing",
    "on hold",
    "completed",
    "refunded",
    "cancelled",
    "failed",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      _id: order._id,
      orderId: order.orderId,
      customer: order.customer,
      products: order.products,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =========================================================
// @desc    Delete an order
// @route   DELETE /api/orders/:id
// =========================================================

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(204).json({ message: "Order Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
