let mongoose = require("mongoose");

let bookingSchema = mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  room_id: {type: mongoose.Schema.Types.ObjectId, ref: "Room"},
  checkin_date: {type: Date, required: true},
  checkout_date: {type: Date, required: true},
  room_Type: {type: String, required: true},
  days: {type: Number, required: true},
  total_price: {type: Number},
    status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  payment_id: { type: String },
  order_id: { type: String },
  payment_status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  }
}, { timestamps: true });

let Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
