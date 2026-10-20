const mongoose = require("mongoose");

const riskFlagSchema = new mongoose.Schema(
  {
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },
    reason: { type: String, required: true },
    triggerSource: { type: String, default: "AUTOMATED_RULE_ENGINE" },
    status: {
      type: String,
      enum: ["OPEN", "REVIEWED", "DISMISSED", "RESOLVED"],
      default: "OPEN",
      index: true,
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RiskFlag", riskFlagSchema);
