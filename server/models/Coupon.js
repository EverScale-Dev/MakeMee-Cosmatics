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
      enum: ["percentage", "fixed", "free_delivery", "buy_x_get_y_free"],
      required: true,
    },
    discountValue: {
      type: Number,
      default: 0, // For free_delivery/buy_x_get_y_free, this can be 0
    },
    // For buy_x_get_y_free: Buy X items, get Y free (cheapest ones)
    buyQuantity: {
      type: Number,
      default: 3, // e.g., Buy 3
    },
    freeQuantity: {
      type: Number,
      default: 1, // e.g., Get 1 free
    },
    // If true, customer must add unique/different products (not same product multiple times)
    uniqueProducts: {
      type: Boolean,
      default: false,
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
    // If true, coupon is visible to customers on the website
    visible: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Check if coupon is valid
// itemCount is total items (with quantities), uniqueItemCount is number of different products
couponSchema.methods.isValid = function (orderAmount = 0, itemCount = 0, uniqueItemCount = 0) {
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

  // For buy_x_get_y_free, check minimum items
  if (this.discountType === "buy_x_get_y_free") {
    const requiredItems = this.buyQuantity + this.freeQuantity;

    // If uniqueProducts is required, check unique item count
    if (this.uniqueProducts) {
      if (uniqueItemCount < requiredItems) {
        return {
          valid: false,
          reason: `Add ${requiredItems - uniqueItemCount} more unique product(s) to use this coupon (Buy ${this.buyQuantity} Get ${this.freeQuantity} Free - requires different products)`,
        };
      }
    } else {
      if (itemCount < requiredItems) {
        return {
          valid: false,
          reason: `Add ${requiredItems - itemCount} more item(s) to use this coupon (Buy ${this.buyQuantity} Get ${this.freeQuantity} Free)`,
        };
      }
    }
  }

  return { valid: true };
};

// Calculate discount for an order
// cartItems is required for buy_x_get_y_free type: [{ price, quantity }]
couponSchema.methods.calculateDiscount = function (subtotal, deliveryCharge, cartItems = []) {
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

    case "buy_x_get_y_free":
      let allPrices = [];

      if (this.uniqueProducts) {
        // Only consider one item per unique product (ignore quantity)
        allPrices = cartItems.map(item => item.price);
      } else {
        // Expand cart items by quantity to get individual item prices
        cartItems.forEach(item => {
          for (let i = 0; i < (item.quantity || 1); i++) {
            allPrices.push(item.price);
          }
        });
      }

      // Sort prices ascending to find cheapest items
      allPrices.sort((a, b) => a - b);

      // Sum the cheapest Y items as discount
      const freeItemCount = Math.min(this.freeQuantity, allPrices.length);
      for (let i = 0; i < freeItemCount; i++) {
        discount += allPrices[i];
      }
      break;
  }

  return Math.round(discount * 100) / 100; // Round to 2 decimal places
};

module.exports = mongoose.model("Coupon", couponSchema);
