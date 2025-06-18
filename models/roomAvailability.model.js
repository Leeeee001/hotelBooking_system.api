let mongoose = require("mongoose");

let roomAvailableSchema = mongoose.Schema({
  room_id: {type: mongoose.Schema.Types.ObjectId, ref: "Room"},
  date: {type: Date, required: true},
  is_Booked: {type: Boolean},
}, { timestamps: true });

let Room_Available = mongoose.model("Room_Available", roomAvailableSchema);
module.exports = Room_Available;
