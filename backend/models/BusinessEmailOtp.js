const mongoose = require("mongoose");

const businessEmailOtpSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("BusinessEmailOtp", businessEmailOtpSchema);
