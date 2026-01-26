const Coupon = require("../../models/Coupon");

// @desc    Validate and get coupon details
// @route   POST /api/coupons/validate
// @access  Public
exports.validateCoupon = async (req, res) => {
  try {
    const { code, subtotal = 0, deliveryCharge = 0, cartItems = [] } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon code" });
    }

    // Calculate total item count (considering quantities)
    const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    // Unique item count = number of different products in cart
    const uniqueItemCount = cartItems.length;

    // Check if coupon is valid for this order
    const validCheck = coupon.isValid(subtotal, itemCount, uniqueItemCount);
    if (!validCheck.valid) {
      return res.status(400).json({ success: false, message: validCheck.reason });
    }

    // Calculate discount (pass cartItems for buy_x_get_y_free)
    const discount = coupon.calculateDiscount(subtotal, deliveryCharge, cartItems);

    res.status(200).json({
      success: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        buyQuantity: coupon.buyQuantity,
        freeQuantity: coupon.freeQuantity,
        uniqueProducts: coupon.uniqueProducts,
        discount, // Calculated discount for this order
      },
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get all coupons (admin)
// @route   GET /api/coupons
// @access  Admin
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get visible coupons for customers
// @route   GET /api/coupons/visible
// @access  Public
exports.getVisibleCoupons = async (req, res) => {
  try {
    const now = new Date();

    // Get active and visible coupons that haven't expired
    const coupons = await Coupon.find({
      isActive: true,
      visible: true,
      $or: [
        { expiryDate: null },
        { expiryDate: { $gt: now } }
      ],
      $or: [
        { startDate: null },
        { startDate: { $lte: now } }
      ]
    })
      .select("code description discountType discountValue minOrderAmount maxDiscount buyQuantity freeQuantity expiryDate")
      .sort({ createdAt: -1 });

    // Filter out coupons that have reached their usage limit
    const validCoupons = coupons.filter(coupon => {
      if (coupon.maxUses === null) return true;
      return coupon.usedCount < coupon.maxUses;
    });

    res.status(200).json({
      success: true,
      coupons: validCoupons.map(c => ({
        code: c.code,
        description: c.description,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minOrderAmount: c.minOrderAmount,
        maxDiscount: c.maxDiscount,
        buyQuantity: c.buyQuantity,
        freeQuantity: c.freeQuantity,
        expiryDate: c.expiryDate,
      })),
    });
  } catch (error) {
    console.error("Error fetching visible coupons:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Create coupon (admin)
// @route   POST /api/coupons
// @access  Admin
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      maxUses,
      expiryDate,
      isActive,
      buyQuantity,
      freeQuantity,
      uniqueProducts,
      visible,
    } = req.body;

    // Check if code already exists
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue: discountValue || 0,
      minOrderAmount: minOrderAmount || 0,
      maxDiscount: maxDiscount || null,
      maxUses: maxUses || null,
      expiryDate: expiryDate || null,
      isActive: isActive !== false,
      buyQuantity: buyQuantity || 3,
      freeQuantity: freeQuantity || 1,
      uniqueProducts: uniqueProducts || false,
      visible: visible || false,
    });

    res.status(201).json({ success: true, coupon });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update coupon (admin)
// @route   PUT /api/coupons/:id
// @access  Admin
exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.status(200).json({ success: true, coupon });
  } catch (error) {
    console.error("Error updating coupon:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Delete coupon (admin)
// @route   DELETE /api/coupons/:id
// @access  Admin
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.status(200).json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Increment coupon usage (internal use)
exports.incrementCouponUsage = async (couponCode) => {
  if (!couponCode) return;

  try {
    await Coupon.findOneAndUpdate(
      { code: couponCode.toUpperCase() },
      { $inc: { usedCount: 1 } }
    );
  } catch (error) {
    console.error("Error incrementing coupon usage:", error);
  }
};
