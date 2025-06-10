const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");

const {registerSchema, loginSchema, verifyOtpSchema} = require("../validations/auth.validation");


router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/verify-otp", validate(verifyOtpSchema), authController.verifyOtp);



module.exports = router;
