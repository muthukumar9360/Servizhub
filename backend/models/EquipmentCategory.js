const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
});

const equipmentCategorySchema = new mongoose.Schema(
  {
    mainCategory: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    homeImage: {
      type: String,
      default: "",
    },
    subCategories: [subCategorySchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EquipmentCategory", equipmentCategorySchema, "services");
