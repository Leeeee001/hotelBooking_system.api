const { z } = require("zod");

// Register validation schema
const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  phone_num: z.string().min(10, "Phone must be at least 10 digits"),
  hash_password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]).optional(), // optional, defaults to "user"
});

// Login validation schema
const loginSchema = z.object({
  email: z.string().email().optional(),
  phone_num: z.string().optional(),
  password: z.string().min(6, "Password is required"),
}).refine(data => data.email || data.phone_num, {
  message: "Email and Phone number is required",
});

module.exports = { registerSchema, loginSchema };
