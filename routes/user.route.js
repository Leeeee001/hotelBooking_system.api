const express = require("express");
const router = express.Router();
const { updateProfileSchema } = require("../validation/user.validation");
const { authenticate } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate");
const { getProfile, updateProfile, deleteAccount } = require("../controllers/user.controller");



router.get("/:id", authenticate, getProfile);
router.put("/profile/:id", authenticate, validate(updateProfileSchema), updateProfile);
router.delete("/profile/:id", authenticate, deleteAccount);



module.exports = router;

