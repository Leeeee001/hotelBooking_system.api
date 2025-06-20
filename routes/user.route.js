const express = require("express");
const router = express.Router();

const { authenticate, authorizeRoles } = require("../middlewares/auth.middleware");
const { getProfile, updateProfile, getAvailableRooms, getRoomDetails, bookRoom, getMyBookings, cancelBooking, deleteAccount } = require("../controllers/user.controller");



router.get("/profile", authenticate, authorizeRoles("user"), getProfile);
router.put("/profile", authenticate, authorizeRoles("user"), updateProfile);
router.get("/get-rooms", authenticate, authorizeRoles("user"), getAvailableRooms);
router.get("/room/:room_id", authenticate, authorizeRoles("user"), getRoomDetails);
router.post("/book-room", authenticate, authorizeRoles("user"), bookRoom);
router.get("/bookings", authenticate, authorizeRoles("user"), getMyBookings);
router.put("/cancel-booking/:bookingId", authenticate, authorizeRoles("user"), cancelBooking);
router.delete("/delete-account", authenticate, authorizeRoles("user"), deleteAccount);



module.exports = router;
