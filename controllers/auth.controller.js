const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  //register user by credentials.
  register: async (req, res) => {
    try {
      let userInfo = req.body;

      // Checking user exist or not...
      const existingUser = await User.findOne({
        $or: [{ email: userInfo.email }, { phone_num: userInfo.phone_num }],
      });
      if (existingUser)
        return res
          .status(400)
          .json({ message: `${email} || ${phone_num} already exists` });

      // Hashing password...
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userInfo.hash_password, salt);

      let newUser = new User({
        name,
        email,
        phone_num,
        hash_password: hashedPassword,
        role,
        is_verified: true,
      });

      const data = await newUser.save();
      console.log(data);

      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  },
  login: async (req, res) => {
    try {
      let userInfo = req.body;

      // Checking user exist or not...
      const existingUser = await User.findOne({
        $or: [{ email: userInfo.email }, { phone_num: userInfo.phone_num }],
      });
      if (existingUser) {
        return res.status(400).json({status: 400, error: "User already exists with this email or phone number"});
      }

      //password checking for login...
      const isMatch = await bcrypt.compare(password, user.hash_password);

    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  },
};

module.exports = authController;
