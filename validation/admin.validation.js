// validation/admin.validation.js
const { z } = require("zod");

// 1. Add Hotel
const addHotelSchema = z.object({
  name: z.string().min(1, "Hotel name is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
});

// 2. Add Room
const addRoomSchema = z.object({
  hotelId: z.string().min(1, "Hotel ID is required"),
  name: z.string().min(1, "Room name is required"),
  price: z.number().positive("Price must be a positive number"),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
  features: z.array(z.string()).optional(),
});

// 3. Set Availability
const setAvailabilitySchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  isAvailable: z.boolean(),
});


module.exports = {addHotelSchema, addRoomSchema, setAvailabilitySchema};


