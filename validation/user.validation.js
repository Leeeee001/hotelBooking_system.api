const { z } = require("zod");

// Update Profile Schema
const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email format").optional(),
  phone_num: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .optional(),
});

// Book Room Schema
const bookRoomSchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  guests: z
    .number()
    .int("Guests must be an integer")
    .positive("Guests must be at least 1"),
});

module.exports = { updateProfileSchema, bookRoomSchema };
