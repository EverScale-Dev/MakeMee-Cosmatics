const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      enum: ["home", "shop"],
      required: true,
    },
    desktopImage: {
      type: String,
      required: true,
    },
    mobileImage: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
bannerSchema.index({ location: 1, isActive: 1, order: 1 });

module.exports = mongoose.model("Banner", bannerSchema);
