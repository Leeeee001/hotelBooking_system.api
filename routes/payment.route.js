const express = require("express");
const router = express.Router();
const { verifyPayment } = require("../controllers/payment.controller");
const { authenticate } = require("../middlewares/auth.middleware"); 
const validate = require("../middlewares/validate");
const { verifyPaymentSchema } = require("../validation/payment.validation");

router.post("/verify", authenticate, validate(verifyPaymentSchema), verifyPayment);

// TEST ROUTE TO SHOW Razorpay payment popup (HBS page)
router.get("/test-payment", (req, res) => {
  const { order_id, amount, booking_id } = req.query;

  if (!order_id || !amount || !booking_id) {
    return res.status(400).send("Missing required fields");
  }

  res.render("razorpay-payment", {
    layout: false,
    key_id: process.env.RAZORPAY_KEY_ID,
    order_id,
    amount,
    booking_id,
  });
});


module.exports = router;

