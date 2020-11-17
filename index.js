const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = 3000;
if (dotenv.error) {
  throw dotenv.error;
}

app.get("/", (req, res) => {
  res.end("It's working");
});

app.listen(port, () => {
  console.log("Application work fine");
});
