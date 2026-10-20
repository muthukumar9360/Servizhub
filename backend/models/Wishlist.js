const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EquipmentListing",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

wishlistSchema.index({ user: 1, equipment: 1 }, { unique: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);
