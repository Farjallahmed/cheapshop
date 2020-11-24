const fs = require("fs"),
  path = require("path"),
  express = require("express"),
  router = express.Router();

class RouterConfig {
  constructor() {
    this.startFolder = null;
  }
  //Called once during initial server startup
  load(app, folderName) {
    if (!this.startFolder) this.startFolder = path.basename(folderName);

    fs.readdirSync(folderName).forEach((file) => {
      const fullName = path.join(folderName, file);
      const stat = fs.lstatSync(fullName);

      if (stat.isDirectory()) {
        //Recursively walk-through folders
        this.load(app, fullName);
      } else if (file.toLowerCase().indexOf(".controller.js")) {
        //Grab path to JavaScript file and use it to construct the route
        let dirs = path.dirname(fullName).split(path.sep);
        if (dirs[0].toLowerCase() === this.startFolder.toLowerCase()) {
          dirs.splice(0, 1);
        }
        //Generate the route
        const baseRoute = "/" + dirs.join("/");
        console.log("Created route: " + baseRoute + " for " + fullName);
        //Load the JavaScript file ("controller") and pass the router to it
        const controllerClass = require("../" + fullName);
        const controller = new controllerClass(router);
        //Associate the route with the router
        app.use(baseRoute, router);
      }
    });
  }
}

module.exports = new RouterConfig();