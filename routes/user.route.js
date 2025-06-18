const express = require("express");
const router = express.Router();

const { authenticate, authorizeRoles } = require("../middlewares/auth.middleware");
const { getProfile, updateProfile, getAvailableRooms, getRoomDetails } = require("../controllers/user.controller");



router.get("/profile", authenticate, authorizeRoles("user"), getProfile);
router.put("/profile", authenticate, authorizeRoles("user"), updateProfile);
router.get("/get-rooms", authenticate, authorizeRoles("user"), getAvailableRooms);
router.get("/room/:room_id", authenticate, authorizeRoles("user"), getRoomDetails);


module.exports = router;
