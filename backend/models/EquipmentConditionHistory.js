const mongoose = require("mongoose");

const equipmentConditionHistorySchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EquipmentListing",
      required: true,
      index: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    condition: {
      type: String,
      enum: ["EXCELLENT", "GOOD", "FAIR", "DAMAGED", "UNUSABLE"],
      required: true,
    },
    stage: {
      type: String,
      enum: ["PRE_RENTAL", "HANDOVER", "RETURN", "POST_INSPECTION"],
      required: true,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: "" },
      },
    ],
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EquipmentConditionHistory", equipmentConditionHistorySchema);
