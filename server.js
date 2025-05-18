// server 
require("dotenv").config();
const express = require("express");
const dbConnect = require("./config/db");

const app = express();
const port = process.env.PORT || 5000;

// app.get("/", (req, res) => {
//   res.send(`<h2>server is running....</h2>`);
// });

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

dbConnect();

