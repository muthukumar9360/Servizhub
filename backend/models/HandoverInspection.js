const mongoose = require("mongoose");

const handoverInspectionSchema = new mongoose.Schema(
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
    inspector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    handoverDate: {
      type: Date,
      default: Date.now,
    },
    serialNumberVerified: {
      type: Boolean,
      default: true,
    },
    serialNumber: {
      type: String,
      default: "",
    },
    meterReading: {
      type: String,
      default: "0 Hours / N/A",
    },
    condition: {
      type: String,
      enum: ["EXCELLENT", "GOOD", "FAIR"],
      default: "EXCELLENT",
    },
    checklist: [
      {
        item: { type: String, required: true },
        status: { type: String, enum: ["PASS", "FAIL", "N/A"], default: "PASS" },
      },
    ],
    inspectionImages: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: "" },
      },
    ],
    notes: { type: String, default: "Equipment verified in full operational order." },
    providerSignoff: { type: Boolean, default: true },
    renterSignoff: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HandoverInspection", handoverInspectionSchema);
