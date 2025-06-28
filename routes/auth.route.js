const express = require("express");
const router = express.Router();
const passport = require("passport");
const {register, login, verifyOtp, resendOtp, forgotPassword, resetPassword, logout} = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");
const {registerSchema, loginSchema, verifyOtpSchema, resendOtpSchema, forgotPasswordSchema, resetPasswordSchema} = require("../validation/auth.validation");

//  Google Auth Routes
router.get("/google", (req, res, next) => {
  const role = req.query.role || "user";
  const state = Buffer.from(JSON.stringify({ role })).toString("base64");
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state,                       // pass custom role via state
  })(req, res, next);
});


router.get("/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login-failed"
  }),
  (req, res) => {
    const { token, user } = req.user;
    res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });

// Custom Credential register-login routes  
router.post("/register", validate(registerSchema), register);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);

// not fixed yet to test
router.post("/resendOtp", (req, res) => {
  console.log("BODY RECEIVED:", req.body);
  res.json({ received: "tanmoy" });
}, validate(resendOtpSchema), resendOtp);

router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/logout", logout);



module.exports = router;
