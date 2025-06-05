let mongoose = require("mongoose");

let roomSchema = mongoose.Schema({
  hotel_id: {type: mongoose.Schema.Types.ObjectId, ref: "Hotel"},
  room_Type: {type: String, required: true},
  description: {type: String, required: true},
  price_Per_Night: {type: Number, required: true},
  capasity: {type: Number, required: true},
  isAvailable: {type: mongoose.Schema.Types.ObjectId, ref: "Room_Available"}
}, { timestamps: true });

let Room = mongoose.model("Room", roomSchema);
module.exports = Room;
