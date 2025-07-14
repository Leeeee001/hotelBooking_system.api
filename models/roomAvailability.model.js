let mongoose = require("mongoose");

let roomAvailableSchema = mongoose.Schema({
  room_id: {type: mongoose.Schema.Types.ObjectId, ref: "Room"},
  date: {type: Date, required: true},
  is_Booked: {type: Boolean, default: false},
}, { timestamps: true });

roomAvailableSchema.index({ room_id: 1, date: 1 }, { unique: true });

let Room_Available = mongoose.model("Room_Available", roomAvailableSchema);
module.exports = Room_Available;
