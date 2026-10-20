const mongoose = require("mongoose");

const temporaryRegistrationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, lowercase: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["USER", "PROVIDER"], default: "USER" },
    step: {
      type: String,
      enum: ["EMAIL_VERIFICATION_PENDING", "PHONE_VERIFICATION_PENDING"],
      default: "EMAIL_VERIFICATION_PENDING",
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 60 * 1000), // 30 minutes TTL
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TemporaryRegistration", temporaryRegistrationSchema);
