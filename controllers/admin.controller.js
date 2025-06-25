const Hotel = require("../models/hotels.model");

// Add a new Hotel
const addHotel = async (req, res) => {
  try {
    const { name, location, description } = req.body;

    const hotel = new Hotel({
      name,
      location,
      description,
      created_by: req.user._id,
    });

    await hotel.save();

    res.status(201).json({
      message: "Hotel created successfully",
      hotel,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create hotel", details: err.message });
  }
};

// Update hotel
const updateHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const adminId = req.user._id;

    const hotel = await Hotel.findOneAndUpdate(
      { _id: hotelId, created_by: adminId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!hotel) {
      return res
        .status(404)
        .json({ error: "Hotel not found or access denied" });
    }

    res.status(200).json({
      message: "Hotel updated successfully",
      hotel,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update hotel", details: err.message });
  }
};

// Delete hotel
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findOneAndDelete({
      _id: req.params.id,
      created_by: req.user._id,
    });

    if (!hotel)
      return res.status(404).json({ error: "Hotel not found or unauthorized" });

    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addHotel,
  updateHotel,
  deleteHotel,
};
