const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  //register user by credentials...
  register: async (req, res) => {
    try {
      const { name, email, phone_num, hash_password, role } = req.body;
  
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { phone_num }],
      });
  
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "user already exists" });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(hash_password, salt);
  
      // Create new user
      const newUser = new User({
        name,
        email,
        phone_num,
        hash_password: hashedPassword,
        role,
        is_Verified: true, 
      });
  
      const data = await newUser.save();
      console.log(data);
  
      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  },
  //login user by credentials...
  login: async (req, res) => {
    try {
      const { email, phone_num, password } = req.body;

      // Find user by email or phone number
      const existingUser = await User.findOne({
        $or: [{ email }, { phone_num }],
      });

      if (!existingUser) {
        return res.status(404).json({
          status: 404,
          error: "User not found with provided email or phone number",
        });
      }

      // compare passwords
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.hash_password
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          status: 401,
          error: "Invalid password",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: existingUser._id,
          role: existingUser.role,
        },
        process.env.JWT_SECRET || "yourSecretKey",
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        status: 200,
        message: "Login successful",
        data: {
          token,
          user: {
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
          },
        },
      });
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  },
};

module.exports = authController;
