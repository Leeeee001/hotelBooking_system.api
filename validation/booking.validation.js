const { z } = require("zod");

// Booking Schema
const bookRoomSchema = z.object({
  roomId: z.string().length(24),
  checkInDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid check-in date format",
  }),
  checkOutDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid check-out date format",
  }),
});

// Cancel Booking
const cancelBookingSchema = z.object({
  id: z.string().length(24, "Invalid Booking ID"),
});

module.exports = { bookRoomSchema, cancelBookingSchema };
