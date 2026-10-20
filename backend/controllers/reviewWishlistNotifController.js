const Review = require("../models/Review");
const Wishlist = require("../models/Wishlist");
const Notification = require("../models/Notification");
const Booking = require("../models/Booking");
const EquipmentListing = require("../models/EquipmentListing");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

// 1. ADD REVIEW (Only users with completed booking)
const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, "Booking not found.");

  if (booking.renter.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only review equipment you have rented.");
  }

  if (booking.bookingStatus !== "COMPLETED") {
    throw new ApiError(400, "You can only submit a review after the rental booking is COMPLETED.");
  }

  const existingReview = await Review.findOne({ booking: booking._id });
  if (existingReview) {
    throw new ApiError(409, "You have already reviewed this booking.");
  }

  const review = await Review.create({
    user: req.user._id,
    equipment: booking.equipment,
    booking: booking._id,
    rating: Number(rating),
    comment,
  });

  // Recalculate equipment average rating
  const reviews = await Review.find({ equipment: booking.equipment });
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avg = (totalRating / reviews.length).toFixed(1);

  await EquipmentListing.findByIdAndUpdate(booking.equipment, {
    averageRating: Number(avg),
    totalReviews: reviews.length,
  });

  await Notification.create({
    user: booking.provider,
    title: "New Equipment Review!",
    message: `A renter left a ${rating}-star review for your equipment.`,
    type: "REVIEW_RECEIVED",
  });

  return res.status(201).json(new ApiResponse(201, review, "Review submitted successfully!"));
});

// GET EQUIPMENT REVIEWS
const getEquipmentReviews = asyncHandler(async (req, res) => {
  const { equipmentId } = req.params;
  const reviews = await Review.find({ equipment: equipmentId })
    .populate("user", "fullName profileImage")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, reviews, "Reviews retrieved"));
});

// 2. TOGGLE WISHLIST ITEM
const toggleWishlist = asyncHandler(async (req, res) => {
  const { equipmentId } = req.body;

  const existing = await Wishlist.findOne({ user: req.user._id, equipment: equipmentId });

  if (existing) {
    await Wishlist.findByIdAndDelete(existing._id);
    return res.status(200).json(new ApiResponse(200, { added: false }, "Removed from wishlist"));
  } else {
    await Wishlist.create({ user: req.user._id, equipment: equipmentId });
    return res.status(201).json(new ApiResponse(201, { added: true }, "Added to wishlist"));
  }
});

// GET USER WISHLIST
const getMyWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.find({ user: req.user._id })
    .populate({
      path: "equipment",
      populate: { path: "category", select: "mainCategory" },
    })
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, wishlist, "Wishlist retrieved"));
});

// 3. GET NOTIFICATIONS
const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, notifications, "Notifications retrieved"));
});

// MARK NOTIFICATION AS READ
const markNotificationRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Notification.findByIdAndUpdate(id, { read: true });
  return res.status(200).json(new ApiResponse(200, {}, "Notification marked as read"));
});

module.exports = {
  createReview,
  getEquipmentReviews,
  toggleWishlist,
  getMyWishlist,
  getMyNotifications,
  markNotificationRead,
};
