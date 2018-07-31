const mongoose = require("mongoose");

mongoose.Promise = Promise;
mongoose.set("debug", true);

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/relish-app", {
    useMongoClient: true
  })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch(err => {
    console.error(err);
  });

exports.Admin = require("./admin");
exports.Referrer = require("./referrer");
exports.Invitee = require("./invitee");
