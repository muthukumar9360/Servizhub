const express = require("express");
const router = express.Router();
const {
  createReview,
  getEquipmentReviews,
  toggleWishlist,
  getMyWishlist,
  getMyNotifications,
  markNotificationRead,
} = require("../controllers/reviewWishlistNotifController");
const { verifyJWT } = require("../middleware/authMiddleware");

// Public review retrieval
router.get("/reviews/:equipmentId", getEquipmentReviews);

// Authenticated routes
router.use(verifyJWT);

router.post("/reviews", createReview);
router.post("/wishlist/toggle", toggleWishlist);
router.get("/wishlist", getMyWishlist);
router.get("/notifications", getMyNotifications);
router.patch("/notifications/:id/read", markNotificationRead);

module.exports = router;
