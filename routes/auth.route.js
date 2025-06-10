const express = require("express");
const router = express.Router();

const {register, login, verifyOtp} = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");

const {registerSchema, loginSchema, verifyOtpSchema} = require("../validation/auth.validation");


router.post("/auth/register", validate(registerSchema), register);
router.post("/auth/login", validate(loginSchema), login);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);



module.exports = router;
