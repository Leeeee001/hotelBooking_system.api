const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRET || "yourSecretKey";

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
