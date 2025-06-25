const { z } = require("zod");

// Add Hotel
const addHotelSchema = z.object({
  name: z.string().min(1, "Hotel name is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
});

// Update Hotel
const updateHotelSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
  }),
});

// Delete Hotel → no body needed, only route param
const deleteHotelSchema = z.object({
  params: z.object({
    id: z.string().length(24, "Invalid hotel ID"),
  }),
});



module.exports = {addHotelSchema, updateHotelSchema, deleteHotelSchema};



