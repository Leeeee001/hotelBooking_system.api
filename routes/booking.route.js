/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();
const { createBooking } = require("../controllers/booking.controller");
const validate = require("../middlewares/validate");
const { bookRoomSchema, cancelBookingSchema } = require("../validation/booking.validation");
const { authenticate, authorizeRoles } = require("../middlewares/auth.middleware");



router.post("/book", authenticate, authorizeRoles("user"), validate(bookRoomSchema), createBooking);


module.exports = router;

