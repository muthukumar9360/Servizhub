const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EquipmentListing",
      required: true,
      index: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    rentalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    dailyRate: {
      type: Number,
      required: true,
    },
    totalRentalFee: {
      type: Number,
      required: true,
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    fineAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "REFUNDED", "PARTIALLY_REFUNDED"],
      default: "PAID",
    },
    bookingStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED", "REJECTED", "DISPUTED"],
      default: "PENDING",
      index: true,
    },
    returnStatus: {
      type: String,
      enum: ["NOT_RETURNED", "RETURN_REQUESTED", "RETURNED", "INSPECTED", "DAMAGE_REPORTED"],
      default: "NOT_RETURNED",
    },
    pickupDetails: {
      type: String,
      default: "Depot Pickup",
    },
    cancellationReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
