const User = require("../models/users.model");

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

    // Exclude sensitive fields from response
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phone_num: user.phone_num,
        role: user.role,
      },
    });
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



module.exports = { getProfile, updateProfile, deleteAccount };


