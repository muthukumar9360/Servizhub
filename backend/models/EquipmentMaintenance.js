const mongoose = require("mongoose");

const equipmentMaintenanceSchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EquipmentListing",
      required: true,
      index: true,
    },
    maintenanceType: {
      type: String,
      enum: ["ROUTINE_SERVICE", "PREVENTIVE", "REPAIR", "CALIBRATION", "EMERGENCY"],
      required: true,
    },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    cost: { type: Number, default: 0 },
    serviceProvider: { type: String, default: "Authorized Service Center" },
    status: {
      type: String,
      enum: ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "SCHEDULED",
      index: true,
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EquipmentMaintenance", equipmentMaintenanceSchema);
