const Booking = require("../models/booking.model");
const Payment = require("../models/payment.model");
const { verifyPaymentSignature } = require("../services/paymentService");

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, payment_method, billing_info } = req.body;
    console.log("Payment Verification Request:", req.body);
    // Signature Verification
    const isValid = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    console.log("Signature Valid:", isValid);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }
    
    // booking Verification
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Update Booking
    booking.payment_id = razorpay_payment_id;
    booking.order_id = razorpay_order_id;
    booking.payment_status = "success";
    booking.status = "confirmed";
    
    await booking.save();

    // Save Payment
    const payment = await Payment.create({
      user_id: booking.user_id,
      booking_id: booking._id,
      amount: booking.total_price,
      transaction_id: razorpay_payment_id,
      payment_method: payment_method || "upi",
      payment_status: "completed",
      billing_info,
      payment_date: new Date(),
    });

    return res.status(200).json({
      message: "Payment verified successfully",
      booking,
      payment,
    });

  } catch (err) {
    console.log("Error verifying payment:", err);
    return res.status(500).json({ error: err.message });
  }
};



module.exports = { verifyPayment };
