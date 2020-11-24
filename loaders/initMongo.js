const MongoClient = require("mongodb").MongoClient;

module.exports = {
  connectToServer: function (callback) {
    MongoClient.connect(
      "mongodb://localhost:${port}/cheapshop",{ useUnifiedTopology: true },
      (err, client) => {
        global._db = client.db("CheapShop");
        // client.close()
        return callback(err);
      }
      );
    },
};
