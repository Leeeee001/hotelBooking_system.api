let mongoose = require("mongoose");

let bookingSchema = mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  room_id: {type: mongoose.Schema.Types.ObjectId, ref: "Room"},
  room_Type: {type: String},
  days: {type: Number},
  totalprice: {type: Number},
}, { timestamps: true });

let Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
