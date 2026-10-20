const Booking = require("../models/Booking");
const EquipmentListing = require("../models/EquipmentListing");
const DamageReport = require("../models/DamageReport");
const EquipmentConditionHistory = require("../models/EquipmentConditionHistory");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { uploadToCloudinary } = require("../config/cloudinary");
const fs = require("fs");

// 1. RENTER REQUESTS RETURN
const requestReturn = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId);

  if (!booking) throw new ApiError(404, "Booking not found.");
  if (booking.renter.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to request return for this booking.");
  }

  booking.returnStatus = "RETURN_REQUESTED";
  await booking.save();

  await Notification.create({
    user: booking.provider,
    title: "Return Requested!",
    message: `Renter has requested to return equipment for booking ${booking.bookingNumber}. Please perform inspection.`,
    type: "RETURN_REMINDER",
  });

  return res.status(200).json(new ApiResponse(200, booking, "Equipment return requested. Provider notified for inspection."));
});

// 2. PROVIDER / ADMIN INSPECTS AND COMPLETES RETURN (No Damage)
const completeReturnNoDamage = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { condition, notes } = req.body;

  const booking = await Booking.findById(bookingId).populate("equipment");
  if (!booking) throw new ApiError(404, "Booking not found.");

  if (booking.provider.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
    throw new ApiError(403, "Not authorized to inspect and complete return.");
  }

  booking.returnStatus = "INSPECTED";
  booking.bookingStatus = "COMPLETED";
  await booking.save();

  // Reset equipment availability
  await EquipmentListing.findByIdAndUpdate(booking.equipment._id, {
    availabilityStatus: "AVAILABLE",
    condition: condition || "EXCELLENT",
  });

  // Record condition history
  await EquipmentConditionHistory.create({
    equipment: booking.equipment._id,
    booking: booking._id,
    recordedBy: req.user._id,
    condition: condition || "EXCELLENT",
    stage: "POST_INSPECTION",
    notes: notes || "Equipment returned in good condition. Security deposit released.",
  });

  await Notification.create({
    user: booking.renter,
    title: "Booking Completed & Security Deposit Released!",
    message: `Return inspection complete for booking ${booking.bookingNumber}. Your full security deposit (₹${booking.securityDeposit}) has been released.`,
    type: "ACCOUNT_VERIFIED",
  });

  return res.status(200).json(new ApiResponse(200, booking, "Equipment return completed successfully. Deposit released."));
});

// 3. CREATE DAMAGE REPORT (Provider / Admin)
const createDamageReport = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { damageType, description, estimatedCost } = req.body;

  const booking = await Booking.findById(bookingId).populate("equipment");
  if (!booking) throw new ApiError(404, "Booking not found.");

  if (booking.provider.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
    throw new ApiError(403, "Only the equipment provider or admin can file a damage report.");
  }

  const existingReport = await DamageReport.findOne({ booking: booking._id });
  if (existingReport) {
    throw new ApiError(409, "A damage report already exists for this booking.");
  }

  let evidenceImages = [];
  if (req.files && req.files.length > 0) {
    for (let file of req.files) {
      const result = await uploadToCloudinary(file.path, "damage_evidence");
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      evidenceImages.push({ url: result.url, publicId: result.publicId });
    }
  }

  const reportNumber = `DMG-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const damageReport = await DamageReport.create({
    reportNumber,
    booking: booking._id,
    equipment: booking.equipment._id,
    reportedBy: req.user._id,
    damageType: damageType || "PHYSICAL",
    description,
    evidenceImages,
    estimatedCost: Number(estimatedCost || 0),
    status: "REPORTED",
  });

  booking.bookingStatus = "DISPUTED";
  booking.returnStatus = "DAMAGE_REPORTED";
  await booking.save();

  await EquipmentListing.findByIdAndUpdate(booking.equipment._id, {
    availabilityStatus: "MAINTENANCE",
    condition: "DAMAGED",
  });

  await Notification.create({
    user: booking.renter,
    title: "Damage Report Filed for Booking",
    message: `Provider reported damage for booking ${booking.bookingNumber} (${damageReport.reportNumber}). Platform administration is reviewing the evidence.`,
    type: "DAMAGE_REPORTED",
    link: `/user/bookings/${booking._id}`,
  });

  await AuditLog.create({
    actor: req.user._id,
    action: "DAMAGE_REPORTED",
    entityType: "DamageReport",
    entityId: damageReport._id,
    metadata: { reportNumber, estimatedCost },
    ipAddress: req.ip,
  });

  return res.status(201).json(new ApiResponse(201, damageReport, "Damage report filed. Dispute submitted for Admin review."));
});

// 4. GET DAMAGE REPORTS (All for Admin, Filtered for Users)
const getDamageReports = asyncHandler(async (req, res) => {
  let query = {};
  if (req.user.role === "USER") {
    const userBookings = await Booking.find({ renter: req.user._id }).select("_id");
    query = { booking: { $in: userBookings.map((b) => b._id) } };
  } else if (req.user.role === "PROVIDER") {
    const providerBookings = await Booking.find({ provider: req.user._id }).select("_id");
    query = { booking: { $in: providerBookings.map((b) => b._id) } };
  }

  const reports = await DamageReport.find(query)
    .populate("booking")
    .populate("equipment")
    .populate("reportedBy", "fullName email phone role")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, reports, "Damage reports retrieved"));
});

// 5. ADMIN RESOLVE DAMAGE DISPUTE
const resolveDamageDispute = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { status, finalCost, adminDecisionNote } = req.body;

  const report = await DamageReport.findById(reportId).populate("booking").populate("equipment");
  if (!report) throw new ApiError(404, "Damage report not found.");

  if (!["USER_RESPONSIBLE", "PROVIDER_RESPONSIBLE", "SHARED_RESPONSIBILITY", "REJECTED", "RESOLVED"].includes(status)) {
    throw new ApiError(400, "Invalid resolution status.");
  }

  report.status = status;
  report.finalCost = Number(finalCost || report.estimatedCost);
  report.adminDecisionNote = adminDecisionNote || "Decision made by platform administration based on evidence inspection.";
  report.resolvedBy = req.user._id;
  report.resolvedAt = new Date();
  await report.save();

  const booking = await Booking.findById(report.booking._id);
  if (booking) {
    if (status === "USER_RESPONSIBLE" || status === "SHARED_RESPONSIBILITY") {
      booking.fineAmount = report.finalCost;
      booking.totalAmount += report.finalCost;
    }
    booking.bookingStatus = "COMPLETED";
    booking.returnStatus = "INSPECTED";
    await booking.save();
  }

  await EquipmentListing.findByIdAndUpdate(report.equipment._id, {
    availabilityStatus: "AVAILABLE",
    condition: status === "REJECTED" ? "EXCELLENT" : "FAIR",
  });

  await Notification.create({
    user: booking.renter,
    title: "Damage Dispute Resolved",
    message: `Admin has resolved damage dispute (${report.reportNumber}). Decision: ${status.replace(/_/g, " ")}. Note: ${adminDecisionNote}`,
    type: "DAMAGE_RESOLVED",
  });

  await AuditLog.create({
    actor: req.user._id,
    action: "DAMAGE_RESOLVED",
    entityType: "DamageReport",
    entityId: report._id,
    metadata: { status, finalCost: report.finalCost, adminDecisionNote },
    ipAddress: req.ip,
  });

  return res.status(200).json(new ApiResponse(200, report, "Damage dispute resolved successfully."));
});

module.exports = {
  requestReturn,
  completeReturnNoDamage,
  createDamageReport,
  getDamageReports,
  resolveDamageDispute,
};
