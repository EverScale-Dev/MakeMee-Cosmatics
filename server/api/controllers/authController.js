const Joi = require('joi');
const crypto = require("crypto");
const sendEmail = require("../../utils/sendMail");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

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
    const message = `Dear ${fullName},\n\nHere is your temporary password: ${randomPassword}\nfor this ${email}\nPlease use this password to complete your registration.\n\nRegards,\nKwality Ecom Team`;

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
