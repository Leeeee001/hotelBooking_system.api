const { z } = require("zod");

// Add Hotel
const addHotelSchema = z.object({
  hotel_name: z.string().min(1, "Hotel name is required"),
  address: z.string().min(1, "Location is required"),
  pin: z.string().regex(/^\d{6}$/, "Pin must be a 6-digit number"),
  description: z.string().optional(),
});

// Update Hotel
const updateHotelSchema = z.object({
    hotel_name: z.string().optional(),
    address: z.string().optional(),
    pin: z.string().regex(/^\d{6}$/, "Pin must be a 6-digit number"),
    description: z.string().optional()
});

// Delete Hotel → no body needed, only route param
const deleteHotelSchema = z.object({
    id: z.string().length(24, "Invalid hotel ID")
});

module.exports = { addHotelSchema, updateHotelSchema, deleteHotelSchema };
