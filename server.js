// server 
require("dotenv").config(); // for environment variables
const express = require("express");
const dbConnect = require("./config/db");
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const adminRoute = require("./routes/admin.route");
const roomRoute = require("./routes/room.route");
const bookingRoute = require("./routes/booking.route");
const paymentRoute = require("./routes/payment.route");
const passport = require("./config/passport"); 
const app = express();

// Body parser middleware to parse incoming request bodies
app.use(express.json());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// swagger doc packages
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swagger_option = require("./config/swaggerOptions.json").options;
swagger_option.apis = ["./docs/**/*.yaml"];
const specs = swaggerJsdoc(swagger_option);
exports.specs = specs;


dbConnect(); // database connection....
const port = process.env.PORT || 5000;

// Default Route
app.get("/", (req, res) => {
  res.send("<h2>🚀 server is running....</h2>");
});


app.use(passport.initialize());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/room", roomRoute); 
app.use("/api/booking", bookingRoute);
app.use("/api/payment", paymentRoute); 


// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global Error Handler middleware
app.use((err, req, res, next) => {
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  res.status(500).json({ error: err.message || "Internal Server Error" });
  next();
});

// Swagger UI setup
app.use( "/api-docs", swaggerUi.serve, swaggerUi.setup(specs) );


// server port listening....
app.listen(port, () => {
  console.log(`🚀 Server listening on localhost:${port}`);
});






