const mongoose = require("mongoose");

const handoverRecordSchema = new mongoose.Schema(
  {
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
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    handoverDate: {
      type: Date,
      default: Date.now,
    },
    conditionAtHandover: {
      type: String,
      enum: ["EXCELLENT", "GOOD", "FAIR"],
      default: "EXCELLENT",
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: "" },
      },
    ],
    renterSignatureConfirmed: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HandoverRecord", handoverRecordSchema);
