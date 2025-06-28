// server 
require("dotenv").config(); // for environment variables
const express = require("express");
const dbConnect = require("./config/db");
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const adminRoute = require("./routes/admin.route");
const roomRoute = require("./routes/room.route");
const bookingRoute = require("./routes/booking.route");
const passport = require("./config/passport"); 
const app = express();

// Body parser middleware to parse incoming request bodies
app.use(express.json());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

dbConnect(); // database connection....
const port = process.env.PORT || 5000;

// Default Route
app.get("/", (req, res) => {
  res.send("<h2>🚀 server is running....</h2>");
});


app.use(passport.initialize());
app.use("/uploads", express.static("uploads"));

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/room", roomRoute); 
app.use("/booking", bookingRoute); 


// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res) => {
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  res.status(500).json({ error: err.message });
});


// server port listening....
app.listen(port, () => {
  console.log(`🚀 Server listening on localhost:${port}`);
});






