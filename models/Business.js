const mongoose = require("mongoose");

// --- Schema for individual listings (like each Banquet Hall, Caterer, etc.) ---
const listingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, default: 0 },
  numRatings: { type: String, default: "0" },
  location: { type: String, required: true },
  badges: [{ type: String }], // e.g. ['Verified', 'Trending']
  tags: [{ type: String }],   // e.g. ['AC Banquet Halls', 'Event Space']
  contact: { type: String },  // phone number
  whatsapp: { type: String },
  imageUrl: { type: String }, // hall image
  extraInfo: { type: String }, // e.g. "Parking Available"
});

// --- Schema for each subcategory (like Banquet Halls, Caterers, etc.) ---
const subCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    listings: [listingSchema], // ✅ Added array of listings
  },
  { _id: true }
);

// --- Main Category Schema (like Wedding Requisites) ---
const businessCategorySchema = new mongoose.Schema({
  mainCategory: { type: String, required: true },
  description: { type: String, required: true },
  homeImage: { type: String, required: true },
  subCategories: [subCategorySchema],
});

// --- Export Model ---
module.exports = mongoose.model("BusinessCategory", businessCategorySchema, "Businesses");
