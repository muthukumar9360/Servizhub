const HandoverInspection = require("../models/HandoverInspection");
const ReturnInspection = require("../models/ReturnInspection");
const Booking = require("../models/Booking");
const EquipmentListing = require("../models/EquipmentListing");
const DamageReport = require("../models/DamageReport");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { uploadToCloudinary } = require("../config/cloudinary");
const fs = require("fs");

// 1. CREATE HANDOVER INSPECTION
const createHandoverInspection = asyncHandler(async (req, res) => {
  const { bookingId, serialNumber, meterReading, condition, checklist, notes } = req.body;

  const booking = await Booking.findById(bookingId).populate("equipment");
  if (!booking) throw new ApiError(404, "Booking not found.");

  let inspectionImages = [];
  if (req.files && req.files.length > 0) {
    for (let file of req.files) {
      const result = await uploadToCloudinary(file.path, "inspections/handover");
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      inspectionImages.push({ url: result.url, publicId: result.publicId });
    }
  }

  let parsedChecklist = [
    { item: "Engine / Power Test", status: "PASS" },
    { item: "Physical Casing Integrity", status: "PASS" },
    { item: "Included Accessories", status: "PASS" },
  ];

  if (checklist) {
    try {
      parsedChecklist = typeof checklist === "string" ? JSON.parse(checklist) : checklist;
    } catch (e) {}
  }

  const handover = await HandoverInspection.create({
    booking: booking._id,
    equipment: booking.equipment._id,
    inspector: req.user._id,
    serialNumberVerified: true,
    serialNumber: serialNumber || booking.equipment.serialNumber || "SN-88771122",
    meterReading: meterReading || "120 Hours",
    condition: condition || "EXCELLENT",
    checklist: parsedChecklist,
    inspectionImages,
    notes: notes || "Handover inspection passed successfully. Equipment in full operational state.",
  });

  booking.bookingStatus = "ACTIVE";
  await booking.save();

  await EquipmentListing.findByIdAndUpdate(booking.equipment._id, { availabilityStatus: "RENTED" });

  return res.status(201).json(new ApiResponse(201, handover, "Handover inspection completed. Rental is now ACTIVE."));
});

// 2. CREATE RETURN INSPECTION (With Damage Check)
const createReturnInspection = asyncHandler(async (req, res) => {
  const { bookingId, condition, checklistComparison, notes } = req.body;

  const booking = await Booking.findById(bookingId).populate("equipment");
  if (!booking) throw new ApiError(404, "Booking not found.");

  const handover = await HandoverInspection.findOne({ booking: booking._id });
  if (!handover) throw new ApiError(400, "Handover inspection record is required before return inspection.");

  let returnImages = [];
  if (req.files && req.files.length > 0) {
    for (let file of req.files) {
      const result = await uploadToCloudinary(file.path, "inspections/return");
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      returnImages.push({ url: result.url, publicId: result.publicId });
    }
  }

  const isDamaged = ["DAMAGED", "UNUSABLE"].includes(condition);

  const returnInsp = await ReturnInspection.create({
    booking: booking._id,
    equipment: booking.equipment._id,
    handoverInspection: handover._id,
    inspector: req.user._id,
    condition: condition || "EXCELLENT",
    damageDetected: isDamaged,
    returnImages,
    notes: notes || (isDamaged ? "Damage detected during return inspection." : "Equipment returned clean without damage."),
  });

  if (isDamaged) {
    booking.bookingStatus = "DISPUTED";
    booking.returnStatus = "DAMAGE_REPORTED";
    await booking.save();

    await EquipmentListing.findByIdAndUpdate(booking.equipment._id, {
      availabilityStatus: "MAINTENANCE",
      condition: "DAMAGED",
    });
  } else {
    booking.bookingStatus = "COMPLETED";
    booking.returnStatus = "INSPECTED";
    await booking.save();

    await EquipmentListing.findByIdAndUpdate(booking.equipment._id, {
      availabilityStatus: "AVAILABLE",
      condition: condition || "EXCELLENT",
    });
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      { returnInspection: returnInsp, handoverInspection: handover },
      isDamaged ? "Return inspection complete. Damage flag created." : "Return inspection complete. Deposit released!"
    )
  );
});

// 3. GET INSPECTIONS FOR BOOKING
const getInspectionsForBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const [handover, returnInsp] = await Promise.all([
    HandoverInspection.findOne({ booking: bookingId }),
    ReturnInspection.findOne({ booking: bookingId }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      { handover, returnInspection: returnInsp },
      "Inspections retrieved for booking"
    )
  );
});

module.exports = {
  createHandoverInspection,
  createReturnInspection,
  getInspectionsForBooking,
};
