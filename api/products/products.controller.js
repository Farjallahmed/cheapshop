const moment = require("moment");
const ObjectId = require("mongodb").ObjectId;

class Products {
  constructor(router) {
    router.post("/", this.Add.bind(this));
    router.post("/alternative", this.getAlternative.bind(this));
    router.get("/categories", this.getCategories.bind(this));
    router.get("/categories/:categorytId", this.getProductByCategory.bind(this));
  }

  
  Add(req, res) {}

  getAlternative(req, res) {
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

  getCategories(req, res) {
    global._db
      .collection("categories")
      .find({})
      .toArray((err, result) => {
        if (err) return res.json(err);
        return res.status(200).json(result);
      });
  }
  
  getProductByCategory(req, res) {
    global._db
      .collection("products")
      .find({ categories: ObjectId(req.params.categorytId) })
      .toArray((err, result) => {
        if (err) return res.json(err);
        return res.status(200).json(result);
      });
  }

  
}
module.exports = Products;
