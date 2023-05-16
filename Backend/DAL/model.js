const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  email: String,
  paid: Boolean,
  firstFriday: String,
});

module.exports = mongoose.model("subs", Schema);
