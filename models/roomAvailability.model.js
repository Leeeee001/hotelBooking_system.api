let mongoose = require("mongoose");

let roomSchema = mongoose.Schema({
  room_id: {type: mongoose.Schema.Types.ObjectId, ref: "Room"},
  date: {type: date.now()},
  is_Booked: {type: Boolean},
}, { timestamps: true });

let Room = mongoose.model("Room", roomSchema);
module.exports = Room;
