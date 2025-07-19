const Razorpay = require("../services/razorpayInstance");
const Booking = require("../models/booking.model");
const Room = require("../models/rooms.model");
const RoomAvailability = require("../models/roomAvailability.model");


const bookRoom = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;
    const userId = req.user._id;

    console.log("Booking request:", req.body);

    // Validate required input
    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    if (start >= end) {
      return res.status(400).json({ error: "Check-out must be after check-in" });
    }

    // Check room existence
    const room = await Room.findOne({ _id: roomId });
    if (!room) return res.status(404).json({ error: "Room not found" });
    console.log("room: ", room);

    // Build list of dates to check
    const dateList = [];
    let current = new Date(start);
    while (current < end) {
      dateList.push(new Date(current.toISOString().split("T")[0]));
      current.setDate(current.getDate() + 1);
    }
    console.log("Date list for availability check:", dateList);

    // Check room availability for all dates
    const unavailable = await RoomAvailability.find({
      room_id: roomId,
      date: { $in: dateList },
      is_Booked: true,
    });

    if (unavailable.length > 0) {
      return res.status(400).json({ error: "Room not available for selected dates" });
    }

    // Calculate cost
    const totalDays = dateList.length;
    const totalAmount = room.price_Per_Night * totalDays;

    // Create Razorpay order
    const razorpayOrder = await Razorpay.orders.create({
      amount: totalAmount * 100, // in paisa
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    // Temporarily create a booking in "pending" state
    const booking = new Booking({
      user_id: userId,
      room_id: roomId,
      room_Type: room.room_Type,
      checkin_date: start,
      checkout_date: end,
      days: totalDays,
      total_price: totalAmount,
      order_id: razorpayOrder.id, // Store order ID for later verification
      payment_status: "pending",
      status: "pending"
    });
    console.log("Booking created:", booking);
    await booking.save();

    // Return all data to frontend
    res.status(200).json({
      message: "Razorpay order created. Proceed to payment.",
      bookingId: booking._id,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      room,
      totalAmount,
      totalDays,
      checkInDate,
      checkOutDate,
    });

  } catch (err) {
    console.error("🔥 Booking error:", err);
    res.status(500).json({ error: err.message });
  }
};







module.exports = { bookRoom };


