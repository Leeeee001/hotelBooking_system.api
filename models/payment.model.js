const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    booking_id: {type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true},
    order_id: {type: String, required: true, unique: true}, 
    payment_id: { type: String, required: true, unique: true }, 
    razorpay_signature: {type: String, required: true},
    amount: {type: Number, required: true, min: 0},
    bookedOn: { type: Date, default: Date.now },
    payment_method: {type: String, required: true},
    payment_status: {type: String, required: true, enum: ["pending", "completed", "failed", "refunded"], default: "pending"},
    transaction_id: {type: String, unique: true},
    payment_date: {type: Date},
    refund_date: {type: Date},
    billing_info: {
        name: { type: String },
        email: { type: String },
        phone: { type: String },
        address: {
          state: { type: String },
          postalCode: { type: String },
          country: { type: String }
        }
    },
    meta_data: { type: Map, of: String },
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
