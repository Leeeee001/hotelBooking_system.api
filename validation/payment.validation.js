const { z } = require("zod");

const verifyPaymentSchema = z.object({
    razorpay_order_id: z.string().min(1, "Order ID is required"),
    razorpay_payment_id: z.string().min(5, "Payment ID is required"),
    razorpay_signature: z.string().min(5, "Signature is required"),
    bookingId: z.string().length(24, "Invalid booking ID")
});

module.exports = { verifyPaymentSchema };
