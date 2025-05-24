let mongoose = require("mongoose");

let hotelSchema = mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String},
  address: {type: Number, required: true},
  pin: {type: number, required: true},
  city: {type: String},
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});

let Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;
