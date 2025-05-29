let mongoose = require("mongoose");

let hotelSchema = mongoose.Schema({
  hotel_name: {type: String, required: true},
  description: {type: String},
  address: {type: Number, required: true},
  pin: {type: number, required: true},
  city: {type: String}
}, { timestamps: true });

let Hotels = mongoose.model("Hotels", hotelSchema);
module.exports = Hotels;
