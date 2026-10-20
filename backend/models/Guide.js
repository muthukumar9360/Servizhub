const mongoose = require("mongoose");

const GuideSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
});

module.exports = mongoose.model("Guide", GuideSchema, "guides");
