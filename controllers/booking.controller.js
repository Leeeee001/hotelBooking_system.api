const Booking = require("../models/booking.model");
const Room = require("../models/rooms.model");
const RoomAvailability = require("../models/roomAvailability.model");
const { createRazorpayOrder } = require("../services/paymentService");

const createBooking = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { roomId, checkInDate, checkOutDate } = req.body;
    // console.log("Booking request:", { roomId, checkInDate, checkOutDate });

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkIn >= checkOut) {
      return res
        .status(400)
        .json({ error: "Check-out must be after check-in" });
    }

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });
    // console.log("Room:", room);

    // Create date list
    const dateList = [];
    let current = new Date(checkIn);
    while (current < checkOut) {
      dateList.push(new Date(current.toISOString().split("T")[0]));
      current.setDate(current.getDate() + 1);
    }
    // console.log("Checking dates:", dateList);

    // Check availability using room._id directly (already ObjectId)
    const unavailable = await RoomAvailability.find({
      room_id: room._id,
      date: { $in: dateList },
      is_Booked: true,
    });
    // console.log("Unavailable dates:", unavailable);

    if (unavailable.length > 0) {
      return res.status(400).json({
        error: "Room not available on selected dates",
        unavailableDates: unavailable.map(
          (d) => d.date.toISOString().split("T")[0]
        ),
      });
    }

    // Calculate cost
    const totalDays = dateList.length;
    const totalPrice = room.price_Per_Night * totalDays;

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(totalPrice);

    // Create Booking entry
    const newBooking = new Booking({
      user_id,
      room_id: room._id,
      checkin_date: checkIn,
      checkout_date: checkOut,
      room_Type: room.room_Type,
      days: totalDays,
      total_price: totalPrice,
      status: "pending",
      order_id: razorpayOrder.id,
    });
    // console.log("Booking created:", newBooking);
    await newBooking.save();

    res.status(201).json({
      message: "Booking initiated. Complete payment to confirm.",
      booking: newBooking,
      razorpayOrder,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Booking failed", details: err.message });
  }
};

module.exports = { createBooking };
