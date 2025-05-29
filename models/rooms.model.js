let mongoose = require("mongoose");

let roomSchema = mongoose.Schema({
  hotel_id: {type: mongoose.Schema.Types.ObjectId, ref: "Hotel"},
  room_Type: {type: String},
  description: {type: String},
  price_Per_Night: {type: Number},
  capasity: {type: Number}
}, { timestamps: true });

let Room = mongoose.model("Room", roomSchema);
module.exports = Room;
