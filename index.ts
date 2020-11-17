import express from "express";
import { config } from "dotenv";
const app = express();
const port = process.env.PORT || 3000;
const MongoClient = require("mongodb").MongoClient;
const url = `mongodb://localhost:${port}/cheapshop`;

export class Start {
  constructor() {
    if (config().error) {
      throw config().error;
    }
    this.InitDB();
    this.InitServer();
    this.LunchServer();
  }

  InitDB() {
      console.log("Init db success")
  }

  InitServer() {
    app.use(express.json());
    // app.use();
    app.get("/", (req, res) => {
      res.end("Hi tanguy are u okay");
    });
  }

  LunchServer() {
    app.listen(port, () => {
      console.log("Application work fine");
    });
  }
}
let start = new Start();
