const MongoClient = require("mongodb").MongoClient;

module.exports = {
  connectToServer: function (callback) {
    MongoClient.connect(
      "mongodb+srv://cheapshopuser:psm2020@cluster0.jcz1v.mongodb.net/<dbname>?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: false },
      (err, client) => {
        if (err) process.exit(0);
        global._db = client.db("CheapShop");
        // client.close()
        return callback(err);
      }
    );
  },
};
