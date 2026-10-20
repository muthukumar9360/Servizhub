const mongoose = require("mongoose");

const providerSettlementSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    grossAmount: { type: Number, required: true },
    platformCommissionRate: { type: Number, default: 10 }, // 10%
    platformCommissionAmount: { type: Number, required: true },
    netPayoutAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "COMPLETED", "HELD_DISPUTE"],
      default: "COMPLETED",
      index: true,
    },
    settlementDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProviderSettlement", providerSettlementSchema);
