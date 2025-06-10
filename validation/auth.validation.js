const { z } = require("zod");

// Registration validation
const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email.regex(/^[a-zA-Z0-9. _%+-]+@[a-zA-Z0-9. -]+\.[a-zA-Z]{2,}$/, "Invalid email"),
  phone_num: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  hash_password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["user", "admin"]).default("user"),
});

// Login validation
const loginSchema = z.object({
  email: z.string().email.regex(/^[a-zA-Z0-9. _%+-]+@[a-zA-Z0-9. -]+\.[a-zA-Z]{2,}$/, "Invalid email").optional(),
  phone_num: z.string().regex(/^\d{10}$/).optional(),
  hash_password: z.string().min(6, "Password must be at least 6 characters"),
});

// OTP verification validation
const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});


module.exports = { registerSchema, loginSchema, verifyOtpSchema };
