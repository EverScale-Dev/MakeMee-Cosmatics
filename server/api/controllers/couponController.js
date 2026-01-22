const Coupon = require("../../models/Coupon");

// @desc    Validate and get coupon details
// @route   POST /api/coupons/validate
// @access  Public
exports.validateCoupon = async (req, res) => {
  try {
    const { code, subtotal = 0, deliveryCharge = 0 } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon code" });
    }

    // Check if coupon is valid for this order
    const validCheck = coupon.isValid(subtotal);
    if (!validCheck.valid) {
      return res.status(400).json({ success: false, message: validCheck.reason });
    }

    // Calculate discount
    const discount = coupon.calculateDiscount(subtotal, deliveryCharge);

    res.status(200).json({
      success: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
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
