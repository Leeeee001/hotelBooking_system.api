const { z } = require("zod");

// Update Profile Schema
const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email format").optional(),
  phone_num: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .optional(),
}).strict();   // for allows only specified fields


module.exports = { updateProfileSchema };
