const User = require("../models/users.model");
const Hotel = require("../models/hotels.model");
const Room = require("../models/rooms.model");
const RoomAvailability = require("../models/roomAvailability.model");
const Booking = require("../models/booking.model");
const sendEmail = require("../services/emailService");

// View All Bookings for Hotels created by the Admin
const getAllBookings = async (req, res) => {
  try {
    const adminId = req.user._id;

    // Find hotels added by this admin
    const hotels = await Hotel.find({ created_by: adminId });
    const hotelIds = hotels.map((h) => h._id);

    // Find rooms under these hotels
    const rooms = await Room.find({ hotel: { $in: hotelIds } });
    const roomIds = rooms.map((r) => r._id);

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
    res
      .status(500)
      .json({ error: "Failed to fetch bookings", details: error.message });
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

    //sending confirm booking room email
    await sendEmail({
      to: email,
      subject: "Booking Confirmation",
      template: "bookingConfirmMail",
      context: {
        customerName: user.name,
        bookingId: booking._id.toString(),
        checkInDate: booking.checkInDate.toDateString(),
        checkOutDate: booking.checkOutDate.toDateString(),
        roomType: room.name,
        numberOfGuests: booking.guests || 1,
        totalAmount: `₹${booking.totalAmount}`,
        managementLink: `http://localhost:3000/manage-booking/${booking._id}`,
      },
    });

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

    // Sending cancellation email
    const user = await User.findById(userId);
    const room = await Room.findById(booking.roomId).populate(
      "hotelId",
      "name"
    );

    await sendEmail({
      to: user.email,
      subject: "Booking Cancelled",
      template: "bookingCancelledMail",
      context: {
        userName: user.name,
        bookingId: booking._id.toString(),
        hotelName: room.hotelId.name,
        checkInDate: booking.checkInDate.toDateString(),
        checkOutDate: booking.checkOutDate.toDateString(),
        supportLink: `http://localhost:3000/`,
        currentYear: new Date().getFullYear(),
      },
    });

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getAllBookings, bookRoom, getMyBookings, cancelBooking };
