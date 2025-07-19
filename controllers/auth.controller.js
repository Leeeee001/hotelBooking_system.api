const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users.model");
const { generateOTP, otpExpiry, verifyOTP } = require("../utils/otpHelpers");
const sendEmail = require("../services/emailService");
const {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validation/auth.validation");

// Register new user
const register = async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    const { name, email, phone_num, hash_password, role } = parsed.data;
    console.log("req data: ", parsed.data);

    const existingUser = await User.findOne({
      $or: [{ email }, { phone_num }]
    });

    if (existingUser) {
      // console.log("User: ", existingUser);
      return res.status(400).json({ error: "User already exists" });
    }

    const otp = generateOTP();
    const otp_expiry = otpExpiry();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(hash_password, salt);

    const user = new User({
      name,
      email,
      phone_num,
      hash_password: hashedPassword,
      role,
      otp: { code: otp, expiry: otp_expiry },
    });

    // console.log(user)
    await user.save();

    // Sending OTP for verify ragistration
    const purpose = "account varification";
    const otpExp = process.env.OTP_EXPIRY_MINUTES;
    await sendEmail({
      to: email,
      subject: "OTP Verification - Hotel Booking",
      template: "otpMail",
      context: { otp, purpose, otpExp },
    });

    return res
      .status(201)
      .json({ message: "Registration successful, check your email for OTP" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const parsed = verifyOtpSchema.safeParse(req.body);

    const { email, otp } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const storedOtp = user.otp.code;
    const expiryTime = new Date(user.otp.expiry).getTime();

    const isValid = verifyOTP(otp, storedOtp, expiryTime);
    if (!isValid)
      return res.status(400).json({ error: "Invalid or expired OTP" });

    user.is_verified = true;
    user.otp = { code: null, expiry: null };
    await user.save();

    // Sending welcome email after verify ragistration
    const name = user.name.split(" ")[0];
    // console.log(name)
    const bookingLink = "http://localhost:3000/";

    await sendEmail({
      to: email,
      subject: "🎉 Welcome to Luxury Hotels!",
      template: "welcomeMail",
      context: { name, bookingLink },
    });

    return res
      .status(200)
      .json({ message: `OTP verified successfully, Welcome ${name}` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Resend OTP
const resendOtp = async (req, res) => {
  try {
    const parsed = resendOtpSchema.safeParse(req.body);
    const { email, phone_num } = parsed.data;

    const user = await User.findOne({ $or: [{ email }, { phone_num }] });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.is_verified)
      return res.status(400).json({ error: "User is already verified" });

    const now = Date.now();
    const expiryTime = new Date(user.otp.expiry).getTime();

    const isExpired = expiryTime < now;
    if (!isExpired)
      return res.status(400).json({ error: "OTP has not expired yet" });

    // Generate new OTP and expiry
    const newOtp = generateOTP();
    const newExpiry = otpExpiry();

    user.otp = { code: newOtp, expiry: newExpiry };

    await user.save();

    // Send email with new OTP
    await sendEmail({
      to: user.email,
      subject: "OTP Verification - Hotel Booking",
      template: "otpMail",
      context: { otp: newOtp },
    });

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    const { email, phone_num, hash_password } = parsed.data;

    const user = await User.findOne({
      $or: [{ email }, phone_num && { phone_num }].filter(Boolean),
    });
    // console.log("Query:", {
    //   $or: [{ email }, { phone_num }],
    // });
    // console.log("User:", user);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.is_verified)
      return res.status(401).json({ error: "User not verified" });
    if (!user.is_active)
      return res.status(403).json({ error: "User is inactive" });
    if (user.is_deleted)
      return res.status(410).json({ error: "User is deleted" });

    // Compare password
    const isMatch = await bcrypt.compare(hash_password, user.hash_password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET,
      { expiresIn: process.env.TOKEN_EXPIRY || "24h" }
    );
    // console.log("Token:", token);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        phone_num: user.phone_num,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// forget-Password
const forgotPassword = async (req, res) => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);

    const { email, phone_num } = parsed.data;

    const user = await User.findOne({
      $or: [{ email }, { phone_num }],
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = generateOTP();
    const expiry = otpExpiry();

    user.otp = { code: otp, expiry };
    await user.save();

    //sending otp for reset password
    const purpose = "reset your password";
    const otpExpiry = process.env.OTP_EXPIRY_MINUTES;
    await sendEmail({
      to: user.email,
      subject: "Reset-Password OTP",
      template: "otpMail",
      context: { otp, purpose, otpExpiry },
    });

    return res.status(200).json({ message: " OTP sent to email" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Reset-password
const resetPassword = async (req, res) => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);

    const { email, phone_num, otp, new_password } = parsed.data;

    // Find user by email or phone number
    const user = await User.findOne({
      $or: [{ email }, { phone_num }],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check OTP validity
    const isValid = verifyOTP(
      otp,
      user.otp.code,
      new Date(user.otp.expiry).getTime()
    );

    if (!isValid) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(new_password, salt);

    // Update user password & clear OTP
    user.hash_password = hashed;
    user.otp = { code: null, expiry: null };
    await user.save();

    return res.status(200).json({
      message:
        "Password reset successfully. Please login with your new password.",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// user logout
const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  logout,
};
