const express = require("express");
const router = express.Router();
const {addRoom, updateRoom, deleteRoom, getAvailableRooms, getRoomDetails, setAvailability} = require("../controllers/room.controller");
const { authenticate, authorizeRoles } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate");
const upload = require("../middlewares/multer.middleware"); // Multer setup
const {addRoomSchema, updateRoomSchema, setAvailabilitySchema} = require("../validation/room.validation");


router.get("/available", authenticate, getAvailableRooms);
router.get("/:room_id", authenticate, getRoomDetails);

router.post("/", authenticate, authorizeRoles("admin"), upload.array("images", 5), validate(addRoomSchema), addRoom);
router.put("/:id", authenticate, authorizeRoles("admin"), upload.array("images", 5), validate(updateRoomSchema), updateRoom);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteRoom);
router.post("/availability", authenticate, authorizeRoles("admin"), validate(setAvailabilitySchema), setAvailability);



module.exports = router;

