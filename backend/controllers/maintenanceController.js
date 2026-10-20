const EquipmentMaintenance = require("../models/EquipmentMaintenance");
const EquipmentListing = require("../models/EquipmentListing");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

// 1. SCHEDULE MAINTENANCE
const scheduleMaintenance = asyncHandler(async (req, res) => {
  const { equipmentId, maintenanceType, description, startDate, endDate, cost, serviceProvider } = req.body;

  const equipment = await EquipmentListing.findById(equipmentId);
  if (!equipment) throw new ApiError(404, "Equipment not found.");

  const maintenance = await EquipmentMaintenance.create({
    equipment: equipment._id,
    maintenanceType: maintenanceType || "ROUTINE_SERVICE",
    description,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    cost: Number(cost || 0),
    serviceProvider: serviceProvider || "Authorized Service Center",
    status: "SCHEDULED",
  });

  // Mark equipment status as MAINTENANCE
  await EquipmentListing.findByIdAndUpdate(equipment._id, { availabilityStatus: "MAINTENANCE" });

  return res.status(201).json(new ApiResponse(201, maintenance, "Maintenance scheduled. Equipment marked unavailable for rental."));
});

// 2. GET MAINTENANCE RECORDS FOR PROVIDER/ADMIN
const getMaintenanceRecords = asyncHandler(async (req, res) => {
  const records = await EquipmentMaintenance.find()
    .populate({
      path: "equipment",
      select: "name brand serialNumber images",
    })
    .sort({ startDate: -1 });

  return res.status(200).json(new ApiResponse(200, records, "Maintenance records retrieved"));
});

// 3. COMPLETE MAINTENANCE
const completeMaintenance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const maintenance = await EquipmentMaintenance.findById(id);
  if (!maintenance) throw new ApiError(404, "Maintenance record not found.");

  maintenance.status = "COMPLETED";
  await maintenance.save();

  await EquipmentListing.findByIdAndUpdate(maintenance.equipment, {
    availabilityStatus: "AVAILABLE",
    condition: "EXCELLENT",
    healthScore: 98,
  });

  return res.status(200).json(new ApiResponse(200, maintenance, "Maintenance completed. Equipment is back AVAILABLE."));
});

module.exports = {
  scheduleMaintenance,
  getMaintenanceRecords,
  completeMaintenance,
};
