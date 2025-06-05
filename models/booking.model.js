let mongoose = require("mongoose");

let bookingSchema = mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  room_id: {type: mongoose.Schema.Types.ObjectId, ref: "Room"},
  checkin_date: {type: Date, required: true},
  checkout_date: {type: Date, required: true},
  room_Type: {type: String, required: true},
  days: {type: Number, required: true},
  total_price: {type: Number},
}, { timestamps: true });

let Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
