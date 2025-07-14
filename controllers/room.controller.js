const Room = require("../models/rooms.model");
const Hotel = require("../models/hotels.model");
const RoomAvailability = require("../models/roomAvailability.model");

// Get Available Rooms
const getAvailableRooms = async (req, res) => {
  try {
    const { checkInDate, checkOutDate } = req.query;

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        error: "checkInDate and checkOutDate are required",
      });
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    if (start >= end) {
      return res
        .status(400)
        .json({ error: "Check-out must be after check-in" });
    }

    // Build date range
    const dateList = [];
    let current = new Date(start);
    while (current < end) {
      dateList.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    // Find room_ids that are booked on any of those dates
    const unavailableRoomIds = await RoomAvailability.find({
      date: { $in: dateList },
      is_Booked: true,
    }).distinct("room_id");

    // Find rooms not in the above list
    const availableRooms = await Room.find({
      _id: { $nin: unavailableRoomIds },
    }).populate("hotel_id", "hotel_name location");

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
const getRoomDetails = async (req, res, next) => {
  try {
    const { room_id } = req.params;

    const room = await Room.findById(room_id).populate(
      "hotel_id",
      "hotel_name location description"
    );

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json({
      message: "Room details fetched successfully",
      room,
    });
  } catch (err) {
    next(err); // let global error handler take care of it
  }
};

// Admin: Add Room (with images)
const addRoom = async (req, res) => {
  try {
    const { hotel_id, room_Type, description, price_Per_Night, capasity } =
      req.body;

    // Validate hotel existence
    const hotel = await Hotel.findById(hotel_id);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const imagePaths = req.files.map((file) => file.path) || [];
    // console.log("Received files:", imagePaths);
    const room = new Room({
      hotel_id,
      room_Type,
      description,
      price_Per_Night: parseInt(price_Per_Night),
      capasity: parseInt(capasity),
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
    // console.log("roomid: ", roomId);

    // Start with validated body (already parsed by Zod)
    const updateData = { ...req.body };
    // console.log("updateData: ", updateData);

    // Handle image uploads (req.files from multer)
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => file.path);
    }

    // Perform update
    const room = await Room.findByIdAndUpdate(roomId, updateData, {
      new: true,
      runValidators: true,
    });
    // console.log("room: ", room);


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

    if (start >= end) {
      return res.status(400).json({ error: "End date must be after start date" });
    }

    // Generate all dates between start and end
    const dateList = [];
    let current = new Date(start);
    while (current <= end) {
      dateList.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    // Create or update availability for each date
    const updates = await Promise.all(
      dateList.map((date) =>
        RoomAvailability.findOneAndUpdate(
          { room_id: roomId, date },
          { room_id: roomId, date, is_Booked: !isAvailable },
          { upsert: true, new: true }
        )
      )
    );

    res.status(201).json({
      message: "Room availability set successfully",
      roomId,
      updated: updates.length,
      dates: dateList.map((d) => d.toISOString().split("T")[0]),
    });
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
