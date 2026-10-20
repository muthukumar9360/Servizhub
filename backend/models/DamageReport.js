const mongoose = require("mongoose");

const damageReportSchema = new mongoose.Schema(
  {
    reportNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EquipmentListing",
      required: true,
      index: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    damageType: {
      type: String,
      enum: ["PHYSICAL", "FUNCTIONAL", "MISSING_PARTS", "COSMETIC"],
      required: true,
    },
    description: {
      type: String,
      required: [true, "Damage description is required"],
    },
    evidenceImages: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: "" },
      },
    ],
    estimatedCost: {
      type: Number,
      default: 0,
    },
    finalCost: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: [
        "REPORTED",
        "UNDER_REVIEW",
        "USER_RESPONSIBLE",
        "PROVIDER_RESPONSIBLE",
        "SHARED_RESPONSIBILITY",
        "REJECTED",
        "RESOLVED",
      ],
      default: "REPORTED",
      index: true,
    },
    adminDecisionNote: {
      type: String,
      default: "",
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DamageReport", damageReportSchema);
