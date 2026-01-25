const Joi = require('joi');
const crypto = require("crypto");
const sendEmail = require("../../utils/sendMail");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');

let temporaryPasswords = {}; // Store temporary passwords in memory (use a DB in production)

// Generate random password function
function generateRandomPassword() {
  return crypto.randomBytes(8).toString('hex'); // Generate a 16-character random password
}

// Register a new User

exports.register = async (req, res) => {
  const { fullName, email } = req.body;

    // Define validation schema
    const schema = Joi.object({
      fullName: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Full name is required.',
        'string.min': 'Full name must be at least 3 characters.',
        'string.max': 'Full name cannot exceed 50 characters.',
      }),
      email: Joi.string().email().required().messages({
        'string.empty': 'Email is required.',
        'string.email': 'Invalid email format.',
      }),
    });
  
    // Validate input data
    const { error } = schema.validate({ fullName, email }, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map((err) => err.message),
      });
    }

  try {
    // Check if User already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate random password
    const randomPassword = generateRandomPassword();

    // Temporarily store the password in memory
    temporaryPasswords[email] = randomPassword;

    // Prepare the email content
    const message = `Dear ${fullName},\n\nHere is your temporary password: ${randomPassword}\nfor this ${email}\nPlease use this password to complete your registration.\n\nRegards,\nMakeMee Cosmatics Team`;

    // Send password via email
    await sendEmail({
      email: process.env.Admin_Email_Id,
      subject: `Password for ${fullName}`,
      message: message,
    });

    res.status(201).json({ message: 'Password sent to your email. Please enter it to complete registration.' });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Complete registration by checking password
exports.completeRegistration = async (req, res) => {
  const { fullName, email, password } = req.body;

  const registrationSchema = Joi.object({
    fullName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  const { error } = registrationSchema.validate({ fullName, email, password });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Check if the password matches the temporary password
    const storedPassword = temporaryPasswords[email];
    if (!storedPassword || storedPassword !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create a new User
    const newUser = await User.create({
      fullName,
      email,
      password,
    });

    // console.log('User registered:', newUser);

    // Clear the temporary password
    delete temporaryPasswords[email];

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: process.env.Admin_Email_Id,
      token,
    });
  } catch (error) {
    console.error('Error completing registration:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Authenticate a User & get token
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  });

  // Validate input using Joi
  const { error } = loginSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Find User by email
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // console.log("User logged in:", user);

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({   
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("Error logging in User:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot password

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error } = forgotPasswordSchema.validate({ email });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Check if User exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
     // Generate a random password
     const randomPassword = generateRandomPassword();
     user.password = randomPassword; // Hash the random password
     await user.save(); // Save the User with the new password

   // Email message
    const message = `Your new temporary password is: ${randomPassword} \n For Email Id: ${email}
    \n\nPlease log in with this password and change it immediately after logging in.`;

    // Send email with the random password
    try {
      await sendEmail({
        email: process.env.Admin_Email_Id,
        subject: "Password Reset",
        message,
      });

      res.status(200).json({ message: "Temporary password sent to your email." });

    } catch (error) {
      console.error("Email could not be sent:", error);
      user.password = undefined; // Reset the password in case of email failure
      await user.save(); // Reset password field

      res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    console.error("Error in forgot password:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { email, tempPassword, newPassword } = req.body;

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  tempPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(), // Enforce minimum password strength
});

const { error } = resetPasswordSchema.validate({ email, tempPassword, newPassword });
if (error) {
  return res.status(400).json({ message: error.details[0].message });
}

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   // Match the temporary password
   const isMatch = await user.matchPassword(tempPassword);
   if (!isMatch) {
     return res.status(400).json({ message: "Invalid temporary password" });
   }

    // Update the password and hash it
    user.password = newPassword;
    await user.save(); // Bypass the pre-save hook

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password." });
  }
};

// User registration with password
exports.registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  const schema = Joi.object({
    fullName: Joi.string().min(3).max(50).required().messages({
      'string.empty': 'Full name is required.',
      'string.min': 'Full name must be at least 3 characters.',
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required.',
      'string.email': 'Invalid email format.',
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password is required.',
      'string.min': 'Password must be at least 6 characters.',
    }),
  });

  const { error } = schema.validate({ fullName, email, password });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const user = await User.create({
      fullName,
      email,
      password,
      authProvider: 'local',
      role: 'user',
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      authProvider: user.authProvider,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// User login (for regular users)
exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  });

  const { error } = schema.validate({ email, password });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user registered with Google
    if (user.authProvider === 'google' && !user.password) {
      return res.status(401).json({ message: 'Please login with Google' });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
      authProvider: user.authProvider,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin login (separate from user login)
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  });

  const { error } = schema.validate({ email, password });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is an admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const token = jwt.sign({ id: user._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error('Error in admin login:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.User._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
      authProvider: user.authProvider,
      role: user.role,
      phone: user.phone,
      phoneVerified: user.phoneVerified || false,
      addresses: user.addresses || [],
      address: user.address, // Keep for backward compatibility
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const { fullName, phone, address } = req.body;

  try {
    const user = await User.findById(req.User._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields
    if (fullName) user.fullName = fullName;

    // If phone changes, reset verification
    if (phone !== undefined && phone !== user.phone) {
      user.phone = phone;
      user.phoneVerified = false;
    }

    // Keep backward compatibility with old address field
    if (address) {
      user.address = {
        street: address.street || user.address?.street,
        city: address.city || user.address?.city,
        state: address.state || user.address?.state,
        pincode: address.pincode || user.address?.pincode,
      };
    }

    await user.save();

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
      authProvider: user.authProvider,
      role: user.role,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      addresses: user.addresses || [],
      address: user.address,
    });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Import OTP service
const otpService = require('../../utils/otpService');

// Send OTP for phone verification
// Currently sends via Email, will switch to MSG91 when configured
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: 'Valid 10-digit phone number required' });
  }

  try {
    const user = await User.findById(req.User._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send OTP (via email for now, MSG91 when configured)
    const result = await otpService.sendOTP(phone, user.email);

    res.status(200).json({
      message: result.message,
      provider: result.provider, // 'EMAIL' or 'SMS' - helps frontend show appropriate message
    });
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone and OTP required' });
  }

  try {
    // Verify OTP
    const result = otpService.verifyPhoneOTP(phone, otp);

    if (!result.valid) {
      return res.status(400).json({ message: result.message });
    }

    // OTP verified - update user
    const user = await User.findById(req.User._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.phone = phone;
    user.phoneVerified = true;
    await user.save();

    res.status(200).json({
      message: 'Phone verified successfully',
      phone: user.phone,
      phoneVerified: true,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};

// Add new address
exports.addAddress = async (req, res) => {
  const { label, apartment_address, street_address1, city, state, pincode, lat, lng, isDefault } = req.body;

  // Validation
  if (!street_address1 || !city || !state || !pincode) {
    return res.status(400).json({ message: 'Street address, city, state, and pincode are required' });
  }

  if (!/^\d{6}$/.test(pincode)) {
    return res.status(400).json({ message: 'Pincode must be 6 digits' });
  }

  try {
    const user = await User.findById(req.User._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check max addresses limit
    if (user.addresses && user.addresses.length >= 5) {
      return res.status(400).json({ message: 'Maximum 5 addresses allowed. Please delete one to add a new address.' });
    }

    // If this is the first address or isDefault is true, set as default
    const shouldBeDefault = isDefault || !user.addresses || user.addresses.length === 0;

    // If setting as default, unset other defaults
    if (shouldBeDefault && user.addresses) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    const newAddress = {
      label: label || 'Home',
      apartment_address: apartment_address || '',
      street_address1,
      city,
      state,
      pincode,
      lat: lat || null,
      lng: lng || null,
      isDefault: shouldBeDefault,
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      message: 'Address added successfully',
      addresses: user.addresses,
    });
  } catch (error) {
    console.error('Error adding address:', error.message);
    res.status(500).json({ message: 'Failed to add address' });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  const { addressId } = req.params;
  const { label, apartment_address, street_address1, city, state, pincode, lat, lng, isDefault } = req.body;

  try {
    const user = await User.findById(req.User._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Update fields
    if (label) address.label = label;
    if (apartment_address !== undefined) address.apartment_address = apartment_address;
    if (street_address1) address.street_address1 = street_address1;
    if (city) address.city = city;
    if (state) address.state = state;
    if (pincode) {
      if (!/^\d{6}$/.test(pincode)) {
        return res.status(400).json({ message: 'Pincode must be 6 digits' });
      }
      address.pincode = pincode;
    }
    if (lat !== undefined) address.lat = lat;
    if (lng !== undefined) address.lng = lng;

    // Handle default flag
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
      address.isDefault = true;
    }

    await user.save();

    res.status(200).json({
      message: 'Address updated successfully',
      addresses: user.addresses,
    });
  } catch (error) {
    console.error('Error updating address:', error.message);
    res.status(500).json({ message: 'Failed to update address' });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  const { addressId } = req.params;

  try {
    const user = await User.findById(req.User._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const wasDefault = address.isDefault;
    address.deleteOne();

    // If deleted address was default, set first remaining as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      message: 'Address deleted successfully',
      addresses: user.addresses,
    });
  } catch (error) {
    console.error('Error deleting address:', error.message);
    res.status(500).json({ message: 'Failed to delete address' });
  }
};

// Set default address
exports.setDefaultAddress = async (req, res) => {
  const { addressId } = req.params;

  try {
    const user = await User.findById(req.User._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Unset all defaults, then set this one
    user.addresses.forEach(addr => addr.isDefault = false);
    address.isDefault = true;

    await user.save();

    res.status(200).json({
      message: 'Default address updated',
      addresses: user.addresses,
    });
  } catch (error) {
    console.error('Error setting default address:', error.message);
    res.status(500).json({ message: 'Failed to set default address' });
  }
};

// Google OAuth login
exports.googleAuth = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Google credential is required' });
  }

  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Find existing user by googleId or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Update googleId if user exists with email but no googleId
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        if (picture) user.avatar = picture;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        fullName: name,
        email,
        googleId,
        authProvider: 'google',
        avatar: picture,
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
      authProvider: user.authProvider,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error('Google auth error:', error.message);
    res.status(401).json({ message: 'Invalid Google credential' });
  }
};
