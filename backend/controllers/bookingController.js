const Booking = require("../models/Booking");
const EquipmentListing = require("../models/EquipmentListing");
const HandoverRecord = require("../models/HandoverRecord");
const EquipmentConditionHistory = require("../models/EquipmentConditionHistory");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { uploadToCloudinary } = require("../config/cloudinary");
const fs = require("fs");

// Helper: Check Date Overlap
const checkBookingOverlap = async (equipmentId, startDate, endDate, excludeBookingId = null) => {
  const reqStart = new Date(startDate);
  const reqEnd = new Date(endDate);

  const query = {
    equipment: equipmentId,
    bookingStatus: { $in: ["PENDING", "CONFIRMED", "ACTIVE"] },
    startDate: { $lt: reqEnd },
    endDate: { $gt: reqStart },
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await Booking.findOne(query);
  return conflictingBooking;
};

// 1. CHECK AVAILABILITY
const checkAvailability = asyncHandler(async (req, res) => {
  const { equipmentId, startDate, endDate } = req.query;

  if (!equipmentId || !startDate || !endDate) {
    throw new ApiError(400, "equipmentId, startDate, and endDate are required.");
  }

  const conflict = await checkBookingOverlap(equipmentId, startDate, endDate);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        available: !conflict,
        conflictBookingNumber: conflict ? conflict.bookingNumber : null,
      },
      conflict ? "Equipment is already booked for the selected dates." : "Equipment is available!"
    )
  );
});

// 2. CREATE BOOKING
const createBooking = asyncHandler(async (req, res) => {
  const { equipmentId, startDate, endDate, pickupDetails } = req.body;

  const equipment = await EquipmentListing.findById(equipmentId).populate("owner");
  if (!equipment) throw new ApiError(404, "Equipment not found.");

  if (equipment.approvalStatus !== "APPROVED" || equipment.availabilityStatus === "INACTIVE") {
    throw new ApiError(400, "This equipment is currently not available for rental.");
  }

  // Prevent user from renting their own equipment
  if (equipment.owner._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot rent your own equipment.");
  }

  // Overlap verification
  const conflict = await checkBookingOverlap(equipmentId, startDate, endDate);
  if (conflict) {
    throw new ApiError(
      409,
      "Double booking prevented! The selected dates overlap with an existing booking."
    );
  }

  const reqStart = new Date(startDate);
  const reqEnd = new Date(endDate);
  const diffTime = Math.abs(reqEnd - reqStart);
  const rentalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const dailyRate = equipment.rentalPrice;
  const totalRentalFee = dailyRate * rentalDays;
  const securityDeposit = equipment.securityDeposit || 0;
  const deliveryFee = equipment.deliveryAvailable ? equipment.deliveryCharge || 0 : 0;
  const totalAmount = totalRentalFee + securityDeposit + deliveryFee;

  const bookingNumber = `BK-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const booking = await Booking.create({
    bookingNumber,
    renter: req.user._id,
    equipment: equipment._id,
    provider: equipment.owner._id,
    startDate: reqStart,
    endDate: reqEnd,
    rentalDays,
    dailyRate,
    totalRentalFee,
    securityDeposit,
    deliveryFee,
    totalAmount,
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    returnStatus: "NOT_RETURNED",
    pickupDetails: pickupDetails || "Depot Pickup Location",
  });

  // Notify Provider
  await Notification.create({
    user: equipment.owner._id,
    title: "New Equipment Booking!",
    message: `Your equipment '${equipment.name}' has been booked for ${rentalDays} days (${bookingNumber}).`,
    type: "BOOKING_CREATED",
    link: `/provider/bookings`,
  });

  // Log Audit Event
  await AuditLog.create({
    actor: req.user._id,
    action: "BOOKING_CREATED",
    entityType: "Booking",
    entityId: booking._id,
    metadata: { bookingNumber, totalAmount, rentalDays },
    ipAddress: req.ip,
  });

  return res.status(201).json(new ApiResponse(201, booking, "Booking created and confirmed successfully!"));
});

// 3. GET USER'S BOOKINGS
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ renter: req.user._id })
    .populate({
      path: "equipment",
      populate: { path: "owner", select: "fullName phone email profileImage" },
    })
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, bookings, "User bookings retrieved"));
});

// 4. GET PROVIDER'S BOOKINGS
const getProviderBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ provider: req.user._id })
    .populate("renter", "fullName email phone profileImage verification")
    .populate("equipment")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, bookings, "Provider bookings retrieved"));
});

// 5. GET BOOKING BY ID
const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id)
    .populate("renter", "fullName email phone profileImage verification")
    .populate("provider", "fullName email phone profileImage")
    .populate("equipment");

  if (!booking) throw new ApiError(404, "Booking not found.");

  // Security check: Only Renter, Provider, or Admin can view
  if (
    booking.renter._id.toString() !== req.user._id.toString() &&
    booking.provider._id.toString() !== req.user._id.toString() &&
    req.user.role !== "ADMIN" &&
    req.user.role !== "SUPER_ADMIN"
  ) {
    throw new ApiError(403, "You are not authorized to view this booking.");
  }

  const handover = await HandoverRecord.findOne({ booking: booking._id });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        booking,
        handover,
      },
      "Booking details retrieved"
    )
  );
});

// 6. START HANDOVER / ACTIVE RENTAL (Provider / Admin)
const recordHandover = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { conditionAtHandover, notes } = req.body;

  const booking = await Booking.findById(id).populate("equipment");
  if (!booking) throw new ApiError(404, "Booking not found.");

  if (booking.provider.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
    throw new ApiError(403, "Only the equipment provider can perform handover.");
  }

  let images = [];
  if (req.files && req.files.length > 0) {
    for (let file of req.files) {
      const result = await uploadToCloudinary(file.path, "handover_records");
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      images.push({ url: result.url, publicId: result.publicId });
    }
  }

  const handover = await HandoverRecord.create({
    booking: booking._id,
    equipment: booking.equipment._id,
    performedBy: req.user._id,
    conditionAtHandover: conditionAtHandover || "EXCELLENT",
    images,
    notes: notes || "Equipment handed over in clean working state.",
  });

  // Record condition history
  await EquipmentConditionHistory.create({
    equipment: booking.equipment._id,
    booking: booking._id,
    recordedBy: req.user._id,
    condition: conditionAtHandover || "EXCELLENT",
    stage: "HANDOVER",
    images,
    notes: notes || "Handover inspection",
  });

  booking.bookingStatus = "ACTIVE";
  await booking.save();

  // Update equipment status
  await EquipmentListing.findByIdAndUpdate(booking.equipment._id, { availabilityStatus: "RENTED" });

  await Notification.create({
    user: booking.renter,
    title: "Equipment Rental Started!",
    message: `Handover complete for booking ${booking.bookingNumber}. Your rental period has officially started.`,
    type: "BOOKING_CONFIRMED",
  });

  return res.status(200).json(new ApiResponse(200, { booking, handover }, "Handover recorded and rental is now ACTIVE."));
});

// 7. CANCEL BOOKING
const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const booking = await Booking.findById(id);
  if (!booking) throw new ApiError(404, "Booking not found.");

  if (booking.renter.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
    throw new ApiError(403, "Not authorized to cancel this booking.");
  }

  if (booking.bookingStatus === "ACTIVE" || booking.bookingStatus === "COMPLETED") {
    throw new ApiError(400, "Active or completed rentals cannot be cancelled.");
  }

  booking.bookingStatus = "CANCELLED";
  booking.cancellationReason = reason || "Cancelled by user";
  booking.paymentStatus = "REFUNDED";
  await booking.save();

  await EquipmentListing.findByIdAndUpdate(booking.equipment, { availabilityStatus: "AVAILABLE" });

  await Notification.create({
    user: booking.provider,
    title: "Booking Cancelled",
    message: `Booking ${booking.bookingNumber} was cancelled.`,
    type: "BOOKING_CANCELLED",
  });

  return res.status(200).json(new ApiResponse(200, booking, "Booking cancelled successfully. Refund initiated."));
});

module.exports = {
  checkAvailability,
  createBooking,
  getMyBookings,
  getProviderBookings,
  getBookingById,
  recordHandover,
  cancelBooking,
};
