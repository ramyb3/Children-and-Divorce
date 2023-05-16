const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  // _id: Number,
  email: String,
  paid: Boolean,
  // Movies: [{ MovieId: Number, Date: Date }],
});

module.exports = mongoose.model("subs", Schema);
