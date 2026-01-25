const nodemailer = require("nodemailer");
const axios = require("axios");

// In-memory OTP storage (use Redis in production for scalability)
const otpStore = new Map();

// OTP Configuration
const OTP_EXPIRY_MINUTES = 10;
const OTP_LENGTH = 6;

// Generate random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP with expiry
const storeOTP = (identifier, otp) => {
  const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
  otpStore.set(identifier, { otp, expiresAt });

  // Auto-cleanup after expiry
  setTimeout(() => {
    otpStore.delete(identifier);
  }, OTP_EXPIRY_MINUTES * 60 * 1000);
};

// Verify OTP
const verifyOTP = (identifier, userOTP) => {
  const stored = otpStore.get(identifier);

  if (!stored) {
    return { valid: false, message: "OTP expired or not found" };
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(identifier);
    return { valid: false, message: "OTP expired" };
  }

  if (stored.otp !== userOTP) {
    return { valid: false, message: "Invalid OTP" };
  }

  // OTP is valid, remove it
  otpStore.delete(identifier);
  return { valid: true, message: "OTP verified successfully" };
};

// ============ EMAIL OTP (Temporary - for launch) ============
const sendOTPviaEmail = async (email, phone, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"MakeMee Cosmetics" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your OTP for Phone Verification - MakeMee Cosmetics",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #731162;">Phone Verification OTP</h2>
        <p>Your OTP to verify phone number <strong>${phone}</strong> is:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #731162;">${otp}</span>
        </div>
        <p style="color: #666;">This OTP is valid for ${OTP_EXPIRY_MINUTES} minutes.</p>
        <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #999; font-size: 12px;">MakeMee Cosmetics - Be your own kind of beautiful</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`[OTP] Sent via EMAIL to ${email} for phone ${phone}`);
};

// ============ MSG91 OTP (For production - enable when ready) ============
const sendOTPviaMSG91 = async (phone, otp) => {
  const authKey = process.env.MSG91_AUTH_KEY;
  const senderId = process.env.MSG91_SENDER_ID || "MKEMEE";
  const templateId = process.env.MSG91_TEMPLATE_ID;

  if (!authKey || !templateId) {
    throw new Error("MSG91 credentials not configured");
  }

  // Format phone number (add 91 if not present)
  const formattedPhone = phone.startsWith("91") ? phone : `91${phone.replace(/^0+/, "")}`;

  // MSG91 Send OTP API
  const response = await axios.post(
    "https://control.msg91.com/api/v5/otp",
    {
      template_id: templateId,
      mobile: formattedPhone,
      otp: otp,
    },
    {
      headers: {
        "authkey": authKey,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.data.type !== "success") {
    throw new Error(response.data.message || "Failed to send OTP via MSG91");
  }

  console.log(`[OTP] Sent via MSG91 to ${formattedPhone}`);
};

// ============ MAIN FUNCTIONS ============

// Check which provider to use
const useMsg91 = () => {
  return process.env.OTP_PROVIDER === "MSG91" &&
         process.env.MSG91_AUTH_KEY &&
         process.env.MSG91_TEMPLATE_ID;
};

// Send OTP (auto-selects provider)
const sendOTP = async (phone, email = null) => {
  const otp = generateOTP();

  // Store OTP against phone number
  storeOTP(phone, otp);

  try {
    if (useMsg91()) {
      // Production: Use MSG91
      await sendOTPviaMSG91(phone, otp);
      return {
        success: true,
        message: "OTP sent to your phone",
        provider: "SMS"
      };
    } else {
      // Temporary: Use Email
      if (!email) {
        throw new Error("Email required for OTP delivery");
      }
      await sendOTPviaEmail(email, phone, otp);
      return {
        success: true,
        message: "OTP sent to your email",
        provider: "EMAIL"
      };
    }
  } catch (error) {
    // Remove stored OTP on failure
    otpStore.delete(phone);
    console.error("[OTP] Send error:", error.message);
    throw error;
  }
};

// Verify OTP
const verifyPhoneOTP = (phone, otp) => {
  return verifyOTP(phone, otp);
};

module.exports = {
  sendOTP,
  verifyPhoneOTP,
  generateOTP,
  useMsg91,
};
