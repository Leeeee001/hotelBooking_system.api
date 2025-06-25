const Room = require("../models/rooms.model");
const Hotel = require("../models/hotels.model");
const RoomAvailability = require("../models/roomAvailability.model");

// Get Available Rooms
const getAvailableRooms = async (req, res) => {
  try {
    const { checkInDate, checkOutDate } = req.query;

    if (!checkInDate || !checkOutDate) {
      return res
        .status(400)
        .json({ error: "Check-in and check-out dates are required" });
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    if (start >= end) {
      return res
        .status(400)
        .json({ error: "Check-out date must be after check-in date" });
    }

    const dateList = [];
    let current = new Date(start);
    while (current < end) {
      dateList.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    const unavailableRoomIds = await RoomAvailability.find({
      date: { $in: dateList },
      is_Booked: true,
    }).distinct("room_id");

    const availableRooms = await Room.find({
      _id: { $nin: unavailableRoomIds },
    }).populate("hotelId", "name location");

    res.status(200).json({
      message: "Available rooms fetched successfully",
      count: availableRooms.length,
      rooms: availableRooms,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User: Get Room Details
const getRoomDetails = async (req, res) => {
  try {
    const { room_id } = req.params;

    const room = await Room.findById(room_id).populate(
      "hotelId",
      "name location description"
    );

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json({
      message: "Room details fetched successfully",
      room,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Add Room (with images)
const addRoom = async (req, res) => {
  try {
    const { hotelId, name, price, capacity, features } = req.body;

    const imagePaths = req.files?.map((file) => file.path) || [];

    const room = new Room({
      hotelId,
      name,
      price,
      capacity,
      features: typeof features === "string" ? JSON.parse(features) : features,
      images: imagePaths,
    });

    await room.save();

    res.status(201).json({
      message: "Room added successfully",
      room,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to add room",
      details: err.message,
    });
  }
};

// Admin: Update Room (with optional new images)
const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      updateData.images = newImages;
    }

    if (updateData.features && typeof updateData.features === "string") {
      updateData.features = JSON.parse(updateData.features);
    }

    const room = await Room.findByIdAndUpdate(roomId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json({
      message: "Room updated successfully",
      room,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to update room",
      details: err.message,
    });
  }
};

// Admin: Delete Room
const deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id;

    const room = await Room.findByIdAndDelete(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete room",
      details: err.message,
    });
  }
};

// Admin: Set Room Availability
const setAvailability = async (req, res) => {
  try {
    const { roomId, startDate, endDate, isAvailable } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const dateList = [];
    let current = new Date(start);
    while (current <= end) {
      dateList.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    const bulkData = dateList.map((date) => ({
      room_id: roomId,
      date,
      is_Booked: !isAvailable,
    }));

    await RoomAvailability.insertMany(bulkData);

    res.status(201).json({ message: "Room availability set successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAvailableRooms,
  getRoomDetails,
  addRoom,
  updateRoom,
  deleteRoom,
  setAvailability,
};
