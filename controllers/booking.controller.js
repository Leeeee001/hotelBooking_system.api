let mongoose = require("mongoose");
const razorpay = require("../services/razorpayInstance");
const Room = require("../models/rooms.model");
const RoomAvailability = require("../models/roomAvailability.model");

// Room booking
const initiateBooking = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;
    // console.log("Request Body:", req.body);

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

    // Generate dates
    const dateList = [];
    let current = new Date(start);
    while (current < end) {
      dateList.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    // console.log("Date List:", dateList);

    // Check if any of those dates are already booked
    const roomObjectId = new mongoose.Types.ObjectId(roomId);

    const availabilities = await RoomAvailability.find({
      room_id: roomObjectId,
      date: { $in: dateList },
      is_Booked: true,
    });
    if (availabilities.length > 0) {
      return res.status(400).json({
        error: "Room is already booked for the selected dates",
        
      });
    }
    // console.log("availabilities:", availabilities);

    // Create payment order
    const totalAmount = room.price_Per_Night * dateList.length;
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    res.status(200).json({
      message: "Payment order created",
      order_id: razorpayOrder.id,
      key_id: process.env.RAZORPAY_KEY_ID,
      room,
      checkInDate,
      checkOutDate,
      totalAmount,
    });

    // console.log("Razorpay Order:", razorpayOrder);
    // console.log(
    //   "response:",
    //   res.status(200).json({
    //     message: "Payment order created",
    //     order_id: razorpayOrder.id,
    //     room,
    //     checkInDate,
    //     checkOutDate,
    //     totalAmount,
    //   })
    // );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { initiateBooking };
