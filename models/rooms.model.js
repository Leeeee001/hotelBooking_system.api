let mongoose = require("mongoose");

let roomSchema = mongoose.Schema({
  hotel_id: {type: mongoose.Schema.Types.ObjectId, ref: "Hotel"},
  room_Type: {type: String},
  pricePerNight: {type: Number},
  isAvailable: {type: Boolean},
}, { timestamps: true });

let Room = mongoose.model("Room", roomSchema);
module.exports = Room;
