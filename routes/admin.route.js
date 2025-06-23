const express = require("express");
const router = express.Router();
const {
  addHotel,
  addRoom,
  setAvailability,
  getAllBookings,
  updateHotel,
  updateRoom,
  deleteHotel,
  deleteRoom,
} = require("../controllers/admin.controller");
const { authenticate } = require("../middlewares/authenticate");
const { authorizeRoles } = require("../middlewares/authorizeRoles");
const validate = require("../middlewares/validate");
const {
  addHotelSchema,
  addRoomSchema,
  setAvailabilitySchema,
} = require("../validation/admin.validation");

// authorize for admin
const adminOnly = [authenticate, authorizeRoles("admin")];

// admin routes
router.post("/hotel", adminOnly, validate(addHotelSchema), addHotel);
router.post("/room", adminOnly, validate(addRoomSchema), addRoom);
router.post("/availability", adminOnly, validate(setAvailabilitySchema), setAvailability);

router.get("/bookings", adminOnly, getAllBookings);

router.put("/hotel/:id", adminOnly, updateHotel);
router.put("/room/:id", adminOnly, updateRoom);

router.delete("/hotel/:id", adminOnly, deleteHotel);
router.delete("/room/:id", adminOnly, deleteRoom);

module.exports = router;
