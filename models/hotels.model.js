let mongoose = require("mongoose");

let hotelSchema = mongoose.Schema({
  hotel_name: {type: String, required: true},
  description: {type: String},
  address: {type: String, required: true},
  pin: {type: Number, required: true},
  city: {type: String},
  rooms: [{type: mongoose.Schema.Types.ObjectId, ref: "Room"}]
}, { timestamps: true });

let Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;
