const ObjectId = require("mongodb").ObjectId;
const moment = require("moment");

class Caddy {
  constructor(router) {
    router.post("/", this.Add);
    router.post("/:caddy/product", this.AddProduct.bind(this));
    router.put("/:caddy/product", this.RemoveProduct.bind(this));
    router.get("/:caddy/product", this.ListProduit.bind(this));
    router.get("/:user", this.List.bind(this));
    router.put("/:caddy", this.Update.bind(this));
    router.delete("/:caddy", this.Delete.bind(this));
  }

  List(req, res) {
    if (!req.params.user)
      return res.status(400).json({ message: "Id user invalide" });
    if (!req.query.page)
      return res.status(400).json({ message: "page invalide" });
    global._db
      .collection("caddies")
      .aggregate([
        { $match: { user: ObjectId(req.params.user) } },
        // { $unwind: "$products" },
        {
          $lookup: {
            from: "products",
            localField: "products",
            foreignField: "_id",
            as: "result",
          },
        },
        { $skip: (req.body.page - 1) * 5 },
        { $limit: 5 },
        { $sort: { createdAt: -1 } },
      ])
      .toArray((err, caddies) => {
        if (err) return res.json(err);
        return res.status(200).json(caddies);
      });
  }
  async ListProduit(req, res) {
    if (!req.params.caddy)
      return res.status(400).json({ message: "Caddy invalide" });
    global._db
      .collection("caddies")
      .aggregate([{ $match: { _id: ObjectId(req.params.caddy) } }])
      .toArray((err, caddies) => {
        let result = [];
        caddies.forEach(async (caddy) => {
          caddy.products.forEach((el) => {
            global._db
              .collection("products")
              .findOne({ _id: ObjectId(el) }, (err, product) => {
                console.log("Prod :", product);
                result.push(product);
              });
          });
        });
        setTimeout(function () {
          console.log("Res : ", result);
          return res.json(result);
        }, 3000);
      });
  }

  Add(req, res) {
    if (!req.body.user) {
      return res.status(400).json({ message: "Id user invalid" });
    }
    if (!req.body.name || typeof req.body.name !== "string") {
      return res.status(400).json({ message: "name invalid" });
    }
    global._db.collection("caddies").insertOne(
      {
        user: ObjectId(req.body.user),
        name: req.body.name,
        createdAt: moment().utc(1).format(process.env.DATEFORMAT),
      },
      (err) => {
        if (err) return res.json(err);
        return res.status(200).json({ message: "success" });
      }
    );
  }

  Update(req, res) {
    if (!req.params.caddy)
      return res.status(400).json({ message: "Caddy invalide" });

    if (!req.body.user)
      return res.status(400).json({ message: "Id user invalide" });

    if (!req.body.name || typeof req.body.name !== "string")
      return res.status(400).json({ message: "name of caddy invalide" });

    global._db.collection("caddies").updateOne(
      { _id: ObjectId(req.params.caddy), user: ObjectId(req.body.user) },
      {
        $set: {
          name: req.body.name,
          updatedAt: moment().utc(1).format(process.env.DATEFORMAT),
        },
      },
      (err, isUpdated) => {
        console.log(isUpdated);
        if (err) return res.json(err);
        if (isUpdated.result.nModified !== 1)
          return res.status(400).json({ message: "Caddy doesn't exist" });
        else return res.status(200).json({ message: "success" });
      }
    );
  }

  Delete(req, res) {
    if (!req.params.caddy)
      return res.status(400).json({ message: "Caddy invalide" });

    global._db
      .collection("caddies")
      .deleteOne({ _id: ObjectId(req.params.caddy) }, (err, isDeleted) => {
        if (err) return res.status(400).json(err);
        if (isDeleted.result.n === 1)
          return res.status(200).json({ message: "success" });
        else
          return res.status(200).json({
            message: "Caddy est déjà supprimé ou bien il n'existe plus",
          });
      });
  }

  AddProduct(req, res) {
    if (!req.body.product)
      return res.status(400).json({ message: "Product is invalid" });
    if (!req.params.caddy)
      return res.status(400).json({ message: "Caddy is invalid" });
    global._db
      .collection("caddies")
      .updateOne(
        { _id: ObjectId(req.params.caddy) },
        { $push: { products: ObjectId(req.body.product) } },
        (err, isUpdated) => {
          if (err) return res.json(err);
          if (isUpdated.result.nModified !== 1)
            return res.status(400).json({ message: "Caddy doesn't exist" });
          else return res.status(200).json({ message: "success" });
        }
      );
  }

  RemoveProduct(req, res) {
    if (!req.body.product)
      return res.status(400).json({ message: "Product is invalid" });
    if (!req.params.caddy)
      return res.status(400).json({ message: "Caddy is invalid" });

    global._db
      .collection("caddies")
      .updateOne(
        { _id: ObjectId(req.params.caddy) },
        { $pull: { products: ObjectId(req.body.product) } },
        (err, isUpdated) => {
          if (err) return res.json(err);
          if (isUpdated.result.nModified !== 1)
            return res
              .status(400)
              .json({ message: "Produit est supprimé ou n'existe pas" });
          else return res.status(200).json({ message: "success" });
        }
      );
  }
}
module.exports = Caddy;
