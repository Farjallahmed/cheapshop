const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const MongoClient = require("mongodb").MongoClient;
const url = `mongodb://localhost:${port}/cheapshop`;

    if (dotenv.error) {
      throw dotenv.error;
    }


    app.use(express.json());
    // app.use();
    app.get("/", (req, res) => {
      res.end("Hi tanguy are u okay");
    });
  

    app.listen(port, () => {
      console.log("Application work fine");
    });
  

