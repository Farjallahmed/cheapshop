const moment = require("moment");
const ObjectId = require("mongodb").ObjectId;

class Products {
  constructor(router) {
    router.post("/alternative", this.Alternative.bind(this));
    router.post("/:caddy", this.Replace.bind(this));
    // router.post("/:caddy", this.Add.bind(this));
  }

  Add(req, res) {}

  Alternative(req, res) {
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
        { $unwind: "$product" },
        { $match: { "product.name": { $ne: req.body.product } } },
        { $limit: 1 },
      ])
      .next((err, result) => {
        if (err) return res.status(400).json({ message: err });
        return res.status(200).json(result.product);
      });
  }
  
  Replace(req, res) {

  }
}
module.exports = Products;
