const Hotel = require("../models/hotel.model");
const Room = require("../models/room.model");
const RoomAvailability = require("../models/roomAvailability.model");
const Booking = require("../models/booking.model");
const User = require("../models/user.model"); // for user details in booking summary

// ✅ 1. Add a new Hotel
const addHotel = async (req, res) => {
  try {
    const { name, location, description } = req.body;

    const hotel = new Hotel({
      name,
      location,
      description,
      created_by: req.user._id, // logged-in admin
    });

    await hotel.save();

    res.status(201).json({
      message: "Hotel created successfully",
      hotel,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create hotel", details: error.message });
  }
};

// ✅ 2. Add a Room under a Hotel
const addRoom = async (req, res) => {
  try {
    const { hotelId, name, price, capacity, features } = req.body;

    const room = new Room({
      hotel: hotelId,
      name,
      price,
      capacity,
      features,
    });

    await room.save();

    res.status(201).json({
      message: "Room added successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add room", details: error.message });
  }
};

// ✅ 3. Set Room Availability (like calendar slots)
const setAvailability = async (req, res) => {
  try {
    const { roomId, startDate, endDate, isAvailable } = req.body;

    const availability = new RoomAvailability({
      room: roomId,
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      is_available: isAvailable,
    });

    await availability.save();

    res.status(201).json({
      message: "Room availability set successfully",
      availability,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to set availability", details: error.message });
  }
};

// ✅ 4. View All Bookings for Hotels created by the Admin
const getAllBookings = async (req, res) => {
  try {
    const adminId = req.user._id;

    // Find hotels added by this admin
    const hotels = await Hotel.find({ created_by: adminId });
    const hotelIds = hotels.map(h => h._id);

    // Find rooms under these hotels
    const rooms = await Room.find({ hotel: { $in: hotelIds } });
    const roomIds = rooms.map(r => r._id);

    // Find bookings for those rooms
    const bookings = await Booking.find({ room: { $in: roomIds } })
      .populate("room")
      .populate("user", "name email phone_num");

    res.status(200).json({
      message: "Bookings fetched successfully",
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings", details: error.message });
  }
};

// ✅ 5. Update Hotel Details
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
      return res.status(404).json({ error: "Hotel not found or access denied" });
    }

    res.status(200).json({
      message: "Hotel updated successfully",
      hotel,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update hotel", details: error.message });
  }
};

// ✅ 6. Update Room Details
const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;

    const room = await Room.findByIdAndUpdate(
      roomId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json({
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update room", details: error.message });
  }
};

// ✅ 7. Delete Hotel
const deleteHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const adminId = req.user._id;

    const hotel = await Hotel.findOneAndDelete({
      _id: hotelId,
      created_by: adminId,
    });

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found or access denied" });
    }

    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete hotel", details: error.message });
  }
};

// ✅ 8. Delete Room
const deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id;

    const room = await Room.findByIdAndDelete(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete room", details: error.message });
  }
};

module.exports = {
  addHotel,
  addRoom,
  setAvailability,
  getAllBookings,
  updateHotel,
  updateRoom,
  deleteHotel,
  deleteRoom,
};
