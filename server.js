// server 
require("dotenv").config(); // for environment variables
const express = require("express");
const dbConnect = require("./config/db");
const authRoute = require("./routes/auth.route")
const userRoute = require("./routes/user.route")
const passport = require("./config/passport"); // your passport config
const app = express();
app.use(express.json());


dbConnect(); // database connection....
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send(`<h2>🚀 server is running....</h2>`);
});


app.use(passport.initialize());
app.use("/auth", authRoute);
app.use("/user", userRoute);



// server port listening....
app.listen(port, () => {
  console.log(`🚀 Server listening on localhost:${port}`);
});



