const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed", "free_delivery"],
      required: true,
    },
    discountValue: {
      type: Number,
      default: 0, // For free_delivery, this can be 0
    },
    minOrderAmount: {
      type: Number,
      default: 0, // Minimum order amount to apply coupon
    },
    maxDiscount: {
      type: Number,
      default: null, // Cap for percentage discounts
    },
    maxUses: {
      type: Number,
      default: null, // null = unlimited
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      default: null, // null = no expiry
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Check if coupon is valid
couponSchema.methods.isValid = function (orderAmount = 0) {
  const now = new Date();

  if (!this.isActive) return { valid: false, reason: "Coupon is not active" };

  if (this.startDate && now < this.startDate) {
    return { valid: false, reason: "Coupon is not yet active" };
  }

  if (this.expiryDate && now > this.expiryDate) {
    return { valid: false, reason: "Coupon has expired" };
  }

  if (this.maxUses && this.usedCount >= this.maxUses) {
    return { valid: false, reason: "Coupon usage limit reached" };
  }

  if (orderAmount < this.minOrderAmount) {
    return {
      valid: false,
      reason: `Minimum order amount is ₹${this.minOrderAmount}`,
    };
  }

  return { valid: true };
};

// Calculate discount for an order
couponSchema.methods.calculateDiscount = function (subtotal, deliveryCharge) {
  let discount = 0;

  switch (this.discountType) {
    case "percentage":
      discount = (subtotal * this.discountValue) / 100;
      if (this.maxDiscount && discount > this.maxDiscount) {
        discount = this.maxDiscount;
      }
      break;

    case "fixed":
      discount = this.discountValue;
      if (discount > subtotal) {
        discount = subtotal; // Can't discount more than subtotal
      }
      break;

    case "free_delivery":
      discount = deliveryCharge;
      break;
  }

  return Math.round(discount * 100) / 100; // Round to 2 decimal places
};

module.exports = mongoose.model("Coupon", couponSchema);
