const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  email: String,
  authorized: Boolean,
  firstFriday: String,
  verification: Number | null,
});

module.exports = mongoose.model("subs", Schema);
