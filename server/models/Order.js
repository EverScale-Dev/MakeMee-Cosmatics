// const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-sequence')(mongoose);

// const orderSchema = new mongoose.Schema({
//   orderId: { type: Number, unique: true }, 
//   customer: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Customer',
//     required: true
//   },
//   products: [
//     {
//       product: {
//         type: mongoose.Schema.Types.ObjectId,
//         refPath: 'products.productModel', // This will dynamically resolve the reference to Product or CustomProduct
//         required: true
//       },
//       productModel: {
//         type: String,
//         enum: ['Product'], // Specifies which collection the product belongs to
//         required: true
//       },
//       quantity: {
//         type: Number,
//         required: true
//       },
//       name: {
//         type: String,
//         required: true, 
//       },
//       price: {
//         type: Number,
//         required: true,
//       },
//     }
//   ],
//   totalAmount: {
//     type: Number,
//     required: true
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['cashOnDelivery', 'creditCard', 'debitCard', 'netBanking'], // Updated enum values for payment methods
//     required: true,
//   },
//   porterOrderId:{
//     type:String,
//     required: false,
//   },
//   note: {
//     type: String,
//     required: false 
//   },
//   isViewed: { type: Boolean, default: false },  
//   status: {
//     type: String,
//     enum: [
//       'pending payment', 
//       'processing', 
//       'on hold', 
//       'completed', 
//       'refunded', 
//       'cancelled', 
//       'failed'
//     ],
//     default: 'pending payment',
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Apply the auto-increment plugin to the `orderId` field
// orderSchema.plugin(AutoIncrement, { inc_field: 'orderId' });

// module.exports = mongoose.model('Order', orderSchema);


const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = new mongoose.Schema({
  orderId: { type: Number, unique: true },

  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },

  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // single reference to your unified Product model
        required: true,
      },
      quantity: { type: Number, required: true },
      name: { type: String, required: true }, // store product name snapshot
      price: { type: Number, required: true }, // store sale/regular price snapshot
    },
  ],

  totalAmount: { type: Number, required: true },

  paymentMethod: {
    type: String,
    enum: ["cashOnDelivery","onlinePayment", "creditCard", "debitCard", "netBanking"],
    required: true,
  },

  porterOrderId: { type: String },
  note: { type: String },

  isViewed: { type: Boolean, default: false },

  status: {
    type: String,
    enum: [
      "pending payment",
      "processing",
      "on hold",
      "completed",
      "refunded",
      "cancelled",
      "failed",
    ],
    default: "pending payment",
  },

  createdAt: { type: Date, default: Date.now },
});

// Auto-increment orderId
orderSchema.plugin(AutoIncrement, { inc_field: "orderId" });

module.exports = mongoose.model("Order", orderSchema);
