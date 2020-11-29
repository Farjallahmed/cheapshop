const moment = require("moment");
const ObjectId = require("mongodb").ObjectId;

class Products {
  constructor(router) {
    router.post("/", this.replace);
    router.post("/:caddy", this.Add);
  }

  Add(req, res) {}

  replace(req, res) {
    console.log("***  Replace  ***");
    console.log(req.body);
    if (!req.body.product || typeof req.body.product !== "string")
      return res.status(400).json({ message: "Invalid product" });
    if (!req.body.category || typeof req.body.category !== "string")
      return res.status(400).json({ message: "Invalid Category" });

    global._db
      .collection("categories")
      .aggregate([
        { $match: { name: req.body.category } },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "categories",
            as: "product",
          },
        },
        { $match: { name: { $ne: req.body.product } } },
        { $limit: 1 },
        { $unwind: "$product" },
      ])
      .next((err, result) => {
        console.log("Error : ", err);
        console.log("Result : ", result);
      });
  }
  Alternate(req, res) {}
}
module.exports = Products;
