const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "EMAIL_VERIFIED",
        "PHONE_VERIFIED",
        "ACCOUNT_VERIFIED",
        "EQUIPMENT_APPROVED",
        "EQUIPMENT_REJECTED",
        "BOOKING_CREATED",
        "BOOKING_CONFIRMED",
        "BOOKING_CANCELLED",
        "RETURN_REMINDER",
        "DAMAGE_REPORTED",
        "DAMAGE_RESOLVED",
        "REVIEW_RECEIVED",
      ],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
