const { z } = require("zod");

// add rooms vaidation schema
const addRoomSchema = z.object({
  hotel_id: z.string().min(24, "Invalid hotel ID"),
  room_Type: z.string().min(2, "Room type is required"),
  description: z.string().min(5, "Room description is required"),
  price_Per_Night: z.string().regex(/^\d+$/, "Price must be a number"),
  capasity: z.string().regex(/^\d+$/, "Capacity must be a number"),
});

// update rooms validation schema
const updateRoomSchema = z.object({
    room_Type: z.string().optional(),
    price_Per_Night: z.coerce.number().optional(),
    capacity: z.number().optional(),
    description: z.string().optional()
});

// set availability validation schema
const setAvailabilitySchema = z.object({
  roomId: z.string().min(24, "Invalid room ID"),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid start date"),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid end date"),
  isAvailable: z.boolean()
});


module.exports = {
  addRoomSchema,
  updateRoomSchema,
  setAvailabilitySchema,
};
