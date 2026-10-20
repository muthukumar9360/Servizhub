// models/Saved.js
const mongoose = require("mongoose");

const SavedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
});

module.exports = mongoose.model("SavedList", SavedSchema,"SavedList");
