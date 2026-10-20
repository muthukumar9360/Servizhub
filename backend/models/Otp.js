const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "ownerModel",
      index: true,
    },
    ownerModel: {
      type: String,
      required: true,
      enum: ["User", "TemporaryRegistration"],
    },
    purpose: {
      type: String,
      required: true,
      enum: [
        "EMAIL_VERIFICATION",
        "PHONE_VERIFICATION",
        "PASSWORD_RESET",
        "EMAIL_CHANGE",
        "PHONE_CHANGE",
        "TWO_FACTOR_AUTH",
      ],
      index: true,
    },
    channel: {
      type: String,
      required: true,
      enum: ["EMAIL", "PHONE"],
    },
    otp: {
      type: String,
      required: true, // Hashed OTP
    },
    attemptCount: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 5,
    },
    usedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Automatic TTL expiration
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", otpSchema);
