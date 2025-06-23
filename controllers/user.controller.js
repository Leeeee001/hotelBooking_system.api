const User = require("../models/users.model");
const Room = require("../models/rooms.model");
const RoomAvailability = require("../models/roomAvailability.model");
const Booking = require("../models/booking.model");

// get own profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      " -hash_password -otp -provider -is_deleted -is_active -is_verified -createdAt -updatedAt -__v"
    );

    if (!user) return res.status(404).json({ error: "User not found" });
    return res
      .status(200)
      .json({ message: "✔️ user loaded sucessfully!", user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//update user credentials
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone_num } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    // console.log(userId, req.body, user);

    // const user = await User.findById(userId, req.body);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if name is changing
    if (name) user.name = name;

    // Check if email is changing
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists)
        return res.status(400).json({ error: "Email already in use" });
      user.email = email;
    }

    // Check if phone_num is changing
    if (phone_num && phone_num !== user.phone_num) {
      const phoneExists = await User.findOne({ phone_num });
      if (phoneExists)
        return res.status(400).json({ error: "Phone number already in use" });
      user.phone_num = phone_num;
    }

    await user.save();
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phone_num: user.phone_num,
        role: user.role
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get all avaliable rooms
const getAvailableRooms = async () => {
  try {
    const { checkInDate, checkOutDate } = res.query;
    if (!checkInDate || !checkOutDate) {
      return res
        .status(404)
        .json({ error: "check-in and check-out dates required" });
    }

    const start = new date(checkInDate);
    const end = new date(checkOutDate);

    if (start >= end) {
      return res
        .status(400)
        .json({ error: "Check-out must be after check-in" });
    }

    // Create list of dates in the range
    const dateList = [];
    let current = new Date(start);
    while (current < end) {
      dateList.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    // Get all room_ids that are booked or unavailable on any of the selected dates
    const unavailable = await RoomAvailability.find({
      date: { $in: dateList },
      is_Booked: true,
    }).distinct("room_id");

    // Get all room_ids that are available on all selected dates
    const availableRooms = await Room.find({
      _id: { $nin: unavailable },
    }).populate("hotelId", "name location");

    return res.status(200).json({
      message: "Avaliable rooms found",
      count: availableRooms.length,
      rooms: availableRooms,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get a Single Room's Full Details
const getRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId).populate(
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
    return res.status(500).json({ error: err.message });
  }
};

// booking rooms
const bookRoom = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;
    const userId = req.user._id;

    if (!roomId || !checkInDate || !checkOutDate) {
      return res
        .status(400)
        .json({ error: "roomId, checkInDate, and checkOutDate are required" });
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    if (start >= end) {
      return res
        .status(400)
        .json({ error: "Check-out must be after check-in" });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    // Create date range list
    const dateList = [];
    let current = new Date(start);
    while (current < end) {
      dateList.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    // Check all days are available
    const availabilities = await RoomAvailability.find({
      room_id: roomId,
      date: { $in: dateList },
    });

    if (availabilities.length !== dateList.length) {
      return res
        .status(400)
        .json({ error: "Room not available for entire duration" });
    }

    const notAvailable = availabilities.some((day) => day.is_Booked);
    if (notAvailable) {
      return res.status(400).json({ error: "Some dates are already booked" });
    }

    // Mark them as booked
    for (let day of availabilities) {
      day.is_Booked = true;
      await day.save();
    }

    // Create Booking
    const totalDays = dateList.length;
    const totalCost = room.price * totalDays;

    const booking = new Booking({
      userId,
      roomId,
      checkInDate: start,
      checkOutDate: end,
      totalAmount: totalCost,
      status: "confirmed",
    });

    await booking.save();

    res.status(201).json({
      message: "Room booked successfully",
      booking,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// get all bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate({
        path: "roomId",
        select: "room_number type price",
        populate: {
          path: "hotelId",
          select: "name location",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Booking history fetched successfully",
      bookings,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// cancle Bookings
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findOne({
      _id: bookingId,
      userId,
      status: "confirmed",
    });

    if (!booking) {
      return res
        .status(404)
        .json({ error: "Booking not found or already cancelled" });
    }

    const now = new Date();
    const checkIn = new Date(booking.checkInDate);

    if (checkIn <= now) {
      return res
        .status(400)
        .json({ error: "Cannot cancel past or active bookings" });
    }

    // Free up dates in RoomAvailability
    const dateList = [];
    let current = new Date(booking.checkInDate);
    while (current < new Date(booking.checkOutDate)) {
      dateList.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    await RoomAvailability.updateMany(
      {
        room_id: booking.roomId,
        date: { $in: dateList },
      },
      { is_Booked: false }
    );

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete user
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.is_deleted)
      return res.status(400).json({ error: "Account already deleted" });

    user.is_deleted = true;
    user.is_active = false;

    await user.save();

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAvailableRooms,
  getRoomDetails,
  bookRoom,
  getMyBookings,
  cancelBooking,
  deleteAccount,
};
