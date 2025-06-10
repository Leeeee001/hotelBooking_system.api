const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users.model");
const { generateOTP, otpExpiry, verifyOTP } = require("../utils/otpHelpers");
const sendEmail = require("../services/emailService");
const { registerSchema, loginSchema, verifyOtpSchema } = require("../validation/auth.validation");

// Register new user
const register = async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }

    const { name, email, phone_num, hash_password, role } = parsed.data;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone_num }],
    });
    if (existingUser) {
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

    await user.save();

    // Sending email after ragistration
    await sendEmail({
      to: email,
      subject: "OTP Verification - Hotel Booking",
      template: "otpMail",
      context: { otp },
    });

    return res.status(201).json({ message: "Registration successful, check your email for OTP" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const parsed = verifyOtpSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }

    const { email, otp } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const storedOtp = user.otp.code;
    const expiryTime = new Date(user.otp.expiry).getTime();

    const isValid = verifyOTP(otp, storedOtp, expiryTime);
    if (!isValid) return res.status(400).json({ error: "Invalid or expired OTP" });

    user.is_verified = true;
    user.otp = { code: null, expiry: null };
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors });
    }

    const { email, phone_num, hash_password } = parsed.data;

    const user = await User.findOne({
      $or: [{ email }, { phone_num }],
    });

    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.is_verified) return res.status(401).json({ error: "User not verified" });
    if (!user.is_active) return res.status(403).json({ error: "User is inactive" });
    if (user.is_deleted) return res.status(410).json({ error: "User is deleted" });

    // Compare password
    const isMatch = await bcrypt.compare(hash_password, user.hash_password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRY || "24h" }
    );

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


module.exports = {register, login, verifyOtp};
