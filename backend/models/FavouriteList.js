// models/Favourite.js
const mongoose = require("mongoose");

const FavouriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
});

module.exports = mongoose.model("FavouriteList", FavouriteSchema,"FavouriteList");
