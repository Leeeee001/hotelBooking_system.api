const express = require("express");
const router = express.Router();
const { updateProfileSchema, bookRoomSchema } = require("../validation/user.validation")
const { authenticate, authorizeRoles } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate");
const { getProfile, updateProfile, getAvailableRooms, getRoomDetails, bookRoom, getMyBookings, cancelBooking, deleteAccount } = require("../controllers/user.controller");

const userAccess = [authenticate, authorizeRoles("user")];


router.get("/profile", userAccess, getProfile);
router.put("/edit-profile", userAccess, validate(updateProfileSchema), updateProfile);
router.get("/get-rooms", userAccess, getAvailableRooms);
router.get("/room/:room_id", userAccess, getRoomDetails);
router.post("/book-room", userAccess, validate(bookRoomSchema), bookRoom);
router.get("/bookings", userAccess, getMyBookings);
router.put("/cancel-booking/:bookingId", userAccess, cancelBooking);
router.delete("/delete-account", userAccess, deleteAccount);



module.exports = router;

