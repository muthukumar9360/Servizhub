const mongoose = require("mongoose");

const platformSettingSchema = new mongoose.Schema(
  {
    commissionPercentage: { type: Number, default: 10 },
    defaultCancellationPolicy: { type: String, default: "Full refund 48h prior to rental start." },
    defaultSecurityDepositRate: { type: Number, default: 20 }, // 20% of equipment replacement value
    minVerificationForRentals: { type: Boolean, default: true },
    maxRentalDurationDays: { type: Number, default: 90 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlatformSetting", platformSettingSchema);
