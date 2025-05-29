const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    booking_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    amount: {type: Number, required: true, min: 0},
    payment_method: {type: String, required: true, enum: ['credit_card', 'debit_card', 'bank_transfer', 'digital_wallet']},
    payment_status: {type: String, required: true, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending'},
    transaction_id: {type: String, unique: true},
    payment_date: {type: Date, default: Date.now},
    refund_date: {type: Date},
    meta_data: { type: Map, of: String }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
