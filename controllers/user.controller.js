const User = require("../models/users.model");
const Room = require("../models/rooms.model");
const RoomAvailability = require("../models/roomAvailability.model");
const Hotel = require("../models/hotels.model");


// get own profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-hash_password -otp");

        if (!user) return res.status(404).json({ error: "User not found" });
        return res.status(200).json({ message: "✔️ user loaded sucessfully!", user });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

//update user credentials
const updateProfile = async (req, res) => {
    try {
        const { name, email, phone_num } = req.body;
        const userId = req.body._id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Check if name is changing
        if (name) user.name = name;
        // Check if email is changing
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) return res.status(400).json({ error: "Email already in use" });
            user.email = email;
        }

        // Check if phone_num is changing 
        if (phone_num && phone_num !== user.phone_num) {
            const phoneExists = await User.findOne({ phone_num });
            if (phoneExists) return res.status(400).json({ error: "Phone number already in use" });
            user.phone_num = phone_num;
        }

        await user.save();
        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                name: user.name,
                email: user.email,
                phone_num: user.phone_num,
                role: user.role,
                provider: user.provider
            }
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
            return res.status(404).json({ error: "check-in and check-out dates required" });
        }

        const start = new date(checkInDate);
        const end = new date(checkOutDate);

        if (start >= end) {
            return res.status(400).json({ error: "Check-out must be after check-in" });
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
            is_Booked: true
        }).distinct("room_id");

        // Get all room_ids that are available on all selected dates
        const availableRooms = await Room.find({
            _id: { $nin: unavailable }
        }).populate("hotelId", "name location");

        return res.status(200).json({
            message: "Avaliable rooms found",
            count: availableRooms.length,
            rooms: availableRooms
        });

    } catch (err) {
        return req.status(500).json({ error: err.message })
    }
};

// Get a Single Room's Full Details
const getRoomDetails = async (req, res) => {
    try {
        const { roomId } = req.params;

        const room = await Room.findById(roomId).populate("hotelId", "name location description");

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        res.status(200).json({
            message: "Room details fetched successfully",
            room
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};









module.exports = { getProfile, updateProfile, getAvailableRooms, getRoomDetails, }