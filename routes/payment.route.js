const express = require("express");
const router = express.Router();
const { verifyPayment } = require("../controllers/payment.controller");
const { authenticate } = require("../middlewares/auth.middleware"); 
const validate = require("../middlewares/validate");
const { verifyPaymentSchema } = require("../validation/payment.validation");

router.post("/verify", authenticate, validate(verifyPaymentSchema), verifyPayment);


module.exports = router;

