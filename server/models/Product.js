// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: true,
//     trim: true
//   },

//   description: { 
//     type: String, 
//     required: true,
//     trim: true
//   },

//   regularPrice: { 
//     type: Number, 
//     required: true,
//     min: 0
//   },

//   salePrice: { 
//     type: Number, 
//     required: true,
//     min: 0
//   },

//   images: { 
//     type: [String], 
//     required: true,
//     validate: {
//       validator: (arr) => arr.length > 0,
//       message: "At least one image is required"
//     }
//   },

//   badge: {
//     type: String,
//     enum: ["NEW LAUNCH", "BEST SELLER", "DISCOUNT", "LIMITED", "HOT", ""],
//   },

//   weight: {
//     type: String,
//     trim: true,
//   },

//   rating: {
//     type: Number,
//     min: 0,
//     max: 5,
//     default: 4.5
//   },

//   reviews: {
//     type: Number,
//     default: 0
//   },

//   createdAt: { 
//     type: Date, 
//     default: Date.now 
//   }
// });

// module.exports = mongoose.model('Product', productSchema);


const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // --- CORE FIELDS (Essential E-commerce Data) ---
  name: { 
    type: String, 
    required: true,
    trim: true,
    unique: true // Product names should generally be unique
  },

  brand: { // Added for explicit brand reference (since we displayed it on the UI)
    type: String,
    required: true,
    trim: true
  },
  
  description: { // Long/Detailed Description
    type: String, 
    required: true,
    trim: true
  },

  shortDescription: { // Added for quick snippets on listing/cards
    type: String,
    trim: true,
    maxlength: 250
  },

  // --- PRICING & INVENTORY ---
  // Single price fields (for backward compatibility or single-size products)
  regularPrice: {
    type: Number,
    min: 0,
    default: 0
  },

  salePrice: {
    type: Number,
    min: 0,
    default: 0
  },

  // Multiple size variants with individual pricing and stock
  sizes: [{
    ml: { type: Number, required: true },
    originalPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    inStock: { type: Boolean, default: true }
  }],
  
  // --- MEDIA ---
  images: { 
    type: [String], 
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: "At least one image is required"
    }
  },

  slug: { // For clean URLs (e.g., /products/glow-serum-2024)
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  badge: {
    type: String,
    enum: ["NEW LAUNCH", "BEST SELLER", "DISCOUNT", "LIMITED", "HOT", ""],
    default: ""
  },

  // --- COSMETIC/SKINCARE SPECIFIC DETAILS ---
  weight: { // Package size (e.g., "30ml", "15g")
    type: String,
    trim: true,
  },
  
  // Array of ingredients or key benefits (for the "Why You'll Love It" section)
  features: [{
    text: { type: String }, // e.g., "Dermatologist Tested & Approved"
  }],
  
  // Detailed list of key ingredients (for the "Key Ingredients Spotlight" section)
  ingredients: [{
    name: { type: String, required: true }, // e.g., "Hyaluronic Acid"
    benefit: { type: String, default: "" } // e.g., "Deep hydration and plumping."
  }],
  
  sourcingInfo: { // For the "Sourcing" tab
    type: String,
    trim: true,
    default: "Ingredients sourced globally. 100% vegan and cruelty-free."
  },

  howToUse: { // Instructions on how to use the product
    type: String,
    trim: true
  },

  // --- REVIEWS & RATINGS ---
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0 // Default to 0, actual rating calculated from UserReview model
  },

  reviews: {
    type: Number,
    default: 0 // Represents total review count, not the reviews themselves
  },

  // --- TIMESTAMPS ---
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
    timestamps: false // Use manual timestamps if using createdAt/updatedAt fields
});

// Pre-save hook to update 'updatedAt'
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Product', productSchema);