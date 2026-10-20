const mongoose = require("mongoose");

const providerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    businessType: {
      type: String,
      enum: ["INDIVIDUAL_OWNER", "DEPOT_PARTNER", "CORPORATE_RENTAL"],
      default: "DEPOT_PARTNER",
    },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, required: true },
    businessAddress: {
      address: { type: String, default: "" },
      city: { type: String, default: "Chennai" },
      state: { type: String, default: "Tamil Nadu" },
      pincode: { type: String, default: "600001" },
    },
    gstNumber: { type: String, default: "" },
    status: {
      type: String,
      enum: ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "SUSPENDED"],
      default: "APPROVED",
      index: true,
    },
    bankDetails: {
      accountName: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      ifscCode: { type: String, default: "" },
    },
    totalEquipmentListed: { type: Number, default: 0 },
    totalPayoutsReceived: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProviderProfile", providerProfileSchema);
