const User = require("../models/User");
const EquipmentListing = require("../models/EquipmentListing");
const Booking = require("../models/Booking");
const DamageReport = require("../models/DamageReport");
const UserDocument = require("../models/UserDocument");
const AuditLog = require("../models/AuditLog");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

// 1. GET ADMIN DASHBOARD STATS
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    verifiedUsers,
    totalProviders,
    totalEquipment,
    pendingEquipment,
    totalBookings,
    activeBookings,
    completedBookings,
    damageReports,
    pendingDocuments,
  ] = await Promise.all([
    User.countDocuments({ role: "USER" }),
    User.countDocuments({ "verification.adminApproved": true }),
    User.countDocuments({ role: "PROVIDER" }),
    EquipmentListing.countDocuments({}),
    EquipmentListing.countDocuments({ approvalStatus: "PENDING_APPROVAL" }),
    Booking.countDocuments({}),
    Booking.countDocuments({ bookingStatus: "ACTIVE" }),
    Booking.countDocuments({ bookingStatus: "COMPLETED" }),
    DamageReport.countDocuments({}),
    UserDocument.countDocuments({ status: "PENDING" }),
  ]);

  // Total revenue sum
  const revenueAggregation = await Booking.aggregate([
    { $match: { bookingStatus: { $in: ["CONFIRMED", "ACTIVE", "COMPLETED"] } } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" }, totalDeposits: { $sum: "$securityDeposit" } } },
  ]);

  const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;
  const totalDeposits = revenueAggregation[0]?.totalDeposits || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers,
        verifiedUsers,
        totalProviders,
        totalEquipment,
        pendingEquipment,
        totalBookings,
        activeBookings,
        completedBookings,
        damageReports,
        pendingDocuments,
        totalRevenue,
        totalDeposits,
      },
      "Admin dashboard stats retrieved"
    )
  );
});

// 2. GET ALL USERS (Admin filter)
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, status, q } = req.query;
  const query = {};

  if (role) query.role = role;
  if (status) query.status = status;
  if (q) {
    query.$or = [
      { fullName: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { username: { $regex: q, $options: "i" } },
      { phone: { $regex: q, $options: "i" } },
    ];
  }

  const users = await User.find(query).select("-password").sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, users, "Users retrieved"));
});

// 3. TOGGLE USER SUSPENSION
const toggleUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  if (!["ACTIVE", "SUSPENDED"].includes(status)) {
    throw new ApiError(400, "Status must be ACTIVE or SUSPENDED.");
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found.");

  user.status = status;
  await user.save();

  await AuditLog.create({
    actor: req.user._id,
    action: status === "SUSPENDED" ? "USER_SUSPENDED" : "USER_REACTIVATED",
    entityType: "User",
    entityId: user._id,
    metadata: { status },
    ipAddress: req.ip,
  });

  return res.status(200).json(new ApiResponse(200, user, `User account ${status.toLowerCase()} successfully.`));
});

// 4. GET AUDIT LOGS
const getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find()
    .populate("actor", "fullName email role")
    .sort({ createdAt: -1 })
    .limit(100);

  return res.status(200).json(new ApiResponse(200, logs, "Audit logs retrieved"));
});

module.exports = {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAuditLogs,
};
