import express from "express";
const app = express();
const port: string | number = process.env.PORT || 5000;
app.use("*", (req, res) => {
  res.send("<h1>Welcome to your server!</h1>");
});
//create a server object:
app.listen(port, () => console.log(`hosting @${port}`));
// import express from "express";
// import { config } from "dotenv";
// const app = express();
// const port = process.env.PORT || 3000;
// const MongoClient = require("mongodb").MongoClient;
// const url = `mongodb://localhost:${port}/cheapshop`;

// export class Start {
//   constructor() {
//     if (config().error) {
//       throw config().error;
//     }
//     this.InitDB();
//     this.InitServer();
//     this.LunchServer();
//   }

//   InitDB() {
//       console.log("Init db success")
//   }

//   InitServer() {
//     app.use(express.json());
//     // app.use();
//     app.get("/", (req, res) => {
//       res.end("Hi tanguy are u okay");
//     });
//   }

//   LunchServer() {
//     app.listen(port, () => {
//       console.log("Application work fine");
//     });
//   }
// }
// let start = new Start();
