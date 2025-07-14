const { z } = require("zod");

// Booking Schema (User books a room)
const bookRoomSchema = z.object({
    roomId: z.string().length(24, "Invalid Room ID"),
    checkInDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), "Invalid check-in date"),
    checkOutDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), "Invalid check-out date"),
});

// Cancel Booking (by booking ID in URL)
const cancelBookingSchema = z.object({
    id: z.string().length(24, "Invalid Booking ID"),
});

module.exports = { bookRoomSchema, cancelBookingSchema };

