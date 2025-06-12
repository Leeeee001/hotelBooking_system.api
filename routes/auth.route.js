const express = require("express");
const router = express.Router();

const {register, login, verifyOtp, resendOtp} = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");

const {registerSchema, loginSchema, verifyOtpSchema, resendOtpSchema} = require("../validation/auth.validation");


router.post("/register", validate(registerSchema), register);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
router.post("/resendOtp", validate(resendOtpSchema), resendOtp)
router.post("/login", validate(loginSchema), login);



module.exports = router;
