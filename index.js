const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const morgan = require("morgan");
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
    MongoDbLoarder.connectToServer((err,db)=>{console.log(err),console.log(db)})
  }

  InitServer() {
    app.use(morgan("dev"));
    app.use(express.json());
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json({}));
    routerConfig.load(app,'./api');
    app.all("/*", (req, res) => {
      res.end("You have to check wich api you ant to use");
    });
   
  }

  LunchServer() {
    app.listen(port, () => {
      console.log("Used Port : ", port)
      console.log("Server Started...");
    });
  }

}
module.exports = new Server();
