const mongoose = require("mongoose");

const equipmentImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, default: "" },
  isPrimary: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
});

const equipmentListingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Equipment name is required"],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    qrCodeIdentifier: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    serialNumber: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EquipmentCategory",
      required: true,
      index: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    brand: { type: String, default: "" },
    modelName: { type: String, default: "" },
    specifications: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],
    images: [equipmentImageSchema],
    condition: {
      type: String,
      enum: ["EXCELLENT", "GOOD", "FAIR", "DAMAGED", "CRITICAL", "UNUSABLE"],
      default: "EXCELLENT",
    },
    healthScore: { type: Number, default: 95, min: 0, max: 100 },
    totalUsageHours: { type: Number, default: 120 },
    rentalPrice: { type: Number, required: true, min: 0 },
    weeklyDiscountPercent: { type: Number, default: 15 },
    pricingType: {
      type: String,
      enum: ["PER_DAY", "PER_HOUR", "PER_WEEK"],
      default: "PER_DAY",
    },
    securityDeposit: { type: Number, default: 0, min: 0 },
    quantity: { type: Number, default: 1, min: 1 },
    location: {
      address: { type: String, default: "" },
      city: { type: String, default: "Chennai", index: true },
      state: { type: String, default: "Tamil Nadu" },
      pincode: { type: String, default: "600001" },
    },
    pickupInstructions: { type: String, default: "Pick up available at depot location." },
    deliveryAvailable: { type: Boolean, default: true },
    deliveryCharge: { type: Number, default: 500 },
    availabilityStatus: {
      type: String,
      enum: ["AVAILABLE", "RESERVED", "RENTED", "MAINTENANCE", "INACTIVE"],
      default: "AVAILABLE",
      index: true,
    },
    approvalStatus: {
      type: String,
      enum: ["DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED"],
      default: "APPROVED",
      index: true,
    },
    rejectionReason: { type: String, default: "" },
    averageRating: { type: Number, default: 4.8, min: 0, max: 5 },
    totalReviews: { type: Number, default: 8 },
  },
  { timestamps: true }
);

equipmentListingSchema.index({ name: "text", description: "text", brand: "text" });

module.exports = mongoose.model("EquipmentListing", equipmentListingSchema, "servicelist");
