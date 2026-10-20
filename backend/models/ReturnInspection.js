const mongoose = require("mongoose");

const returnInspectionSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
      index: true,
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EquipmentListing",
      required: true,
    },
    handoverInspection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HandoverInspection",
      required: true,
    },
    inspector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    returnDate: {
      type: Date,
      default: Date.now,
    },
    condition: {
      type: String,
      enum: ["EXCELLENT", "GOOD", "FAIR", "DAMAGED", "UNUSABLE"],
      required: true,
    },
    damageDetected: {
      type: Boolean,
      default: false,
    },
    checklistComparison: [
      {
        item: { type: String, required: true },
        handoverStatus: { type: String, default: "PASS" },
        returnStatus: { type: String, enum: ["PASS", "FAIL", "DAMAGED"], default: "PASS" },
      },
    ],
    returnImages: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: "" },
      },
    ],
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReturnInspection", returnInspectionSchema);
