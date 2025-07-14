/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();
const { initiateBooking } = require("../controllers/booking.controller");
const validate = require("../middlewares/validate");
const { bookRoomSchema, cancelBookingSchema } = require("../validation/booking.validation");
const { authenticate, authorizeRoles } = require("../middlewares/auth.middleware");


router.post("/initiate-booking", authenticate, validate(bookRoomSchema), initiateBooking);

module.exports = router;

