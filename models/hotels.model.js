let mongoose = require("mongoose");

let hotelSchema = mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String},
  address: {type: Number, required: true},
  pin: {type: number, required: true},
  city: {type: String}
}, { timestamps: true });

let Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;
