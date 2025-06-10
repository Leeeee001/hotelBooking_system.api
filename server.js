// server 
require("dotenv").config();
const express = require("express");
const dbConnect = require("./config/db");

const app = express();
dbConnect(); // database connection....
const port = process.env.PORT || 5000;


app.get("/", (req, res) => {
  res.send(`<h2>server is running....</h2>`);
});

app.use();

// server port listening....
app.listen(port, () => {
  console.log(`🚀 Server listening on localhost:${port}`);
});






