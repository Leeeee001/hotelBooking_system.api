const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

// Authenticate: Verify JWT token and attach user to request
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.userId);

    // console.log("Decoded:", decoded);

    if (!user || !user.is_active || user.is_deleted)
      return res.status(401).json({ error: "Unauthorized or inactive user" });

    req.user = user;

    // console.log("User:", user);

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Authorize: Restrict route access by role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};


module.exports = { authenticate, authorizeRoles };

