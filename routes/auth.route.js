const express = require("express");
const router = express.Router();

const {register, login, verifyOtp, resendOtp, forgotPassword, resetPassword} = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");
const {registerSchema, loginSchema, verifyOtpSchema, resendOtpSchema, forgotPasswordSchema, resetPasswordSchema} = require("../validation/auth.validation");


router.post("/register", validate(registerSchema), register);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
router.post("/resendOtp", (req, res) => {
  console.log("BODY RECEIVED:", req.body);
  res.json({ received: req.body })
  }, validate(resendOtpSchema), resendOtp)
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);



module.exports = router;
