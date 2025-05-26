const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: {type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    amount: {type: Number, required: true, min: 0},
    currency: {type: String, default: 'USD', required: true},
    paymentMethod: {type: String, required: true, enum: ['credit_card', 'debit_card', 'bank_transfer', 'digital_wallet']},
    paymentStatus: {type: String, required: true, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending'},
    transactionId: {type: String, unique: true},
    paymentDate: {type: Date, default: Date.now},
    billingAddress: {street: String, city: String, state: String, postalCode: String, country: String},
    metadata: { type: Map, of: String }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
