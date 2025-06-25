const express = require("express");
const router = express.Router();
const { getAllBookings, bookRoom, getMyBookings, cancelBooking } = require("../controllers/booking.controller");
const validate = require("../middlewares/validate");
const { bookRoomSchema, cancelBookingSchema } = require("../validation/booking.validation");
const { authenticate, authorizeRoles } = require("../middlewares/auth.middleware");



router.get("/bookings", authenticate, authorizeRoles("admin"), getAllBookings);
router.post("/", authenticate, authorizeRoles("user"), validate(bookRoomSchema), bookRoom);
router.get("/my", authenticate, authorizeRoles("user"), getMyBookings);
router.delete("/:id", authenticate, authorizeRoles("user"), validate(cancelBookingSchema), cancelBooking);

module.exports = router;

