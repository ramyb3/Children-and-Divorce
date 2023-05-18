const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  email: String,
  authorized: Boolean,
  firstFriday: String,
});

module.exports = mongoose.model("subs", Schema);
