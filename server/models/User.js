const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Address sub-schema for multiple addresses
const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' }, // Home, Work, Other
  apartment_address: { type: String }, // Flat/House No
  street_address1: { type: String, required: true }, // Building/Locality/Area
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number },
  isDefault: { type: Boolean, default: false },
}, { _id: true });

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  googleId: { type: String, unique: true, sparse: true },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  avatar: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String },
  phoneVerified: { type: Boolean, default: false },
  addresses: {
    type: [addressSchema],
    validate: [arr => arr.length <= 5, 'Maximum 5 addresses allowed'],
  },
  // Keep old address field for backward compatibility
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to match entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', userSchema);
