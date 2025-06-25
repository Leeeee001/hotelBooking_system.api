const express = require("express");
const router = express.Router();
const { updateProfileSchema } = require("../validation/user.validation")
const { authenticate } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate");
const { getProfile, updateProfile, deleteAccount } = require("../controllers/user.controller");



router.get("/profile", authenticate, getProfile);
router.put("/edit-profile", authenticate, validate(updateProfileSchema), updateProfile);
router.delete("/delete-account", authenticate, deleteAccount);



module.exports = router;

