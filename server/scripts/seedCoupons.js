/**
 * Seed Script: Create initial coupons
 *
 * Run with: node server/scripts/seedCoupons.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env from server directory
dotenv.config({ path: path.join(__dirname, "../.env") });

const Coupon = require("../models/Coupon");

const coupons = [
  {
    code: "FREEDELIVERY",
    description: "Get free delivery on your order",
    discountType: "free_delivery",
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscount: null,
    maxUses: null, // unlimited
    expiryDate: null, // never expires
    isActive: true,
  },
  {
    code: "WELCOME10",
    description: "10% off on your first order",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 500,
    maxDiscount: 200, // max Rs 200 off
    maxUses: null,
    expiryDate: null,
    isActive: true,
  },
  {
    code: "FLAT100",
    description: "Flat Rs 100 off on orders above Rs 999",
    discountType: "fixed",
    discountValue: 100,
    minOrderAmount: 999,
    maxDiscount: null,
    maxUses: null,
    expiryDate: null,
    isActive: true,
  },
];

async function seedCoupons() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    for (const couponData of coupons) {
      const existing = await Coupon.findOne({ code: couponData.code });
      if (existing) {
        console.log(`Coupon "${couponData.code}" already exists, skipping...`);
      } else {
        await Coupon.create(couponData);
        console.log(`Created coupon: ${couponData.code}`);
      }
    }

    console.log("\nCoupon seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding coupons:", error);
    process.exit(1);
  }
}

seedCoupons();
