const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const MongoDbLoarder = require("./loaders/initMongo");
const routerConfig = require("./router/router");

class Server {
  
  constructor() {
    if (dotenv.error) {
      throw dotenv.error;
    }
    this.InitDB();
    this.InitServer();
    this.LunchServer();
  }

  InitDB(){
    MongoDbLoarder.connectToServer((err,db)=>{})
  }

  InitServer() {
    app.use(express.json());
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json({}));
    routerConfig.load(app,'./api');
    app.all("*", (req, res) => {
      res.end("Router is missing ?");
    });
  }

  LunchServer() {
    app.listen(port, () => {
      console.log("Server Started...");
    });
  }

}
module.exports = new Server();
