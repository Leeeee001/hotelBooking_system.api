const { z } = require("zod");

const addRoomSchema = z.object({
  body: z.object({
    hotelId: z.string(),
    name: z.string(),
    price: z.number(),
    capacity: z.number(),
    features: z.array(z.string()),
  }),
});

const updateRoomSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    price: z.number().optional(),
    capacity: z.number().optional(),
    features: z.array(z.string()).optional(),
  }),
});

const setAvailabilitySchema = z.object({
  body: z.object({
    roomId: z.string(),
    startDate: z.string(), // should be date string
    endDate: z.string(),
    isAvailable: z.boolean(),
  }),
});

module.exports = {
  addRoomSchema,
  updateRoomSchema,
  setAvailabilitySchema,
};
