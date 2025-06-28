const Hotel = require("../models/hotels.model");
const {deleteHotelSchema} = require("../validation/admin.validation");

// Add a new Hotel
const addHotel = async (req, res) => {
  try {
    const { hotel_name, address, pin, description } = req.body;

    const hotel = new Hotel({
      hotel_name,
      address,
      pin,
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
    console.log("hotel: ", hotelId, "admin: ", adminId);
    const hotel = await Hotel.findOneAndUpdate(
      { _id: hotelId, created_by: adminId },
      req.body,
      { new: true, runValidators: true }
    );
    console.log("hotel: ", hotel);
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
    // Validate hotel ID from params
    const parsed = deleteHotelSchema.safeParse(req.params);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues });
    }

    const hotelId = parsed.data.id;
    const adminId = req.user._id;

    // Proceed with deletion
    const hotel = await Hotel.findOneAndDelete({
      _id: hotelId,
      created_by: adminId,
    });

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found or unauthorized" });
    }

    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all hotels (for admin)
const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().select(
      "-rooms -__v -createdAt -updatedAt"
    );

    res.status(200).json({
      message: "Hotels fetched successfully",
      count: hotels.length,
      hotels,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addHotel,
  updateHotel,
  deleteHotel,
  getAllHotels,
};
