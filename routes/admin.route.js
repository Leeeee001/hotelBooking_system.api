const express = require("express");
const router = express.Router();
const { addHotel, updateHotel, deleteHotel, getAllHotels } = require("../controllers/admin.controller");
const { authenticate, authorizeRoles } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate");
const { addHotelSchema, updateHotelSchema } = require("../validation/admin.validation");

// authorize for admin
const adminOnly = [authenticate, authorizeRoles("admin")];

// admin routes
router.post("/hotel", adminOnly, validate(addHotelSchema), addHotel);
router.put("/hotel/:id", adminOnly, validate(updateHotelSchema), updateHotel);
router.delete("/hotel/:id", adminOnly, deleteHotel);
router.get("/getAllHotels", adminOnly, getAllHotels);

module.exports = router;

