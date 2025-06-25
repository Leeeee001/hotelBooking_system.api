const { z } = require("zod");

// Booking Schema (User books a room)
const bookRoomSchema = z.object({
  body: z.object({
    roomId: z.string().length(24, "Invalid Room ID"),
    checkInDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid check-in date format",
    }),
    checkOutDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid check-out date format",
    }),
  }),
});

// Cancel Booking (by booking ID in URL)
const cancelBookingSchema = z.object({
  params: z.object({
    id: z.string().length(24, "Invalid Booking ID"),
  }),
});



module.exports = { bookRoomSchema, cancelBookingSchema };


