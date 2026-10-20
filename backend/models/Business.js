const mongoose = require("mongoose");

// SUBCATEGORY (ONLY META DATA)
const subCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { _id: true }
);

// MAIN CATEGORY
const businessCategorySchema = new mongoose.Schema(
  {
    mainCategory: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    homeImage: {
      type: String,
      required: true,
    },
    subCategories: {
      type: [subCategorySchema],
      default: [],
    },
  },
  {
    collection: "Businesses",
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "BusinessCategory",
  businessCategorySchema
);
