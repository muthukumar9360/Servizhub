const express = require("express");
const router = express.Router();
const {
  checkAvailability,
  createBooking,
  getMyBookings,
  getProviderBookings,
  getBookingById,
  recordHandover,
  cancelBooking,
} = require("../controllers/bookingController");
const { verifyJWT } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { bookingCreationValidation } = require("../validations/bookingValidation");

router.get("/check-availability", checkAvailability);

router.use(verifyJWT);

router.post("/", bookingCreationValidation, createBooking);
router.get("/my-bookings", getMyBookings);
router.get("/provider-bookings", authorizeRoles("PROVIDER", "ADMIN", "SUPER_ADMIN"), getProviderBookings);
router.get("/:id", getBookingById);
router.post("/:id/handover", authorizeRoles("PROVIDER", "ADMIN", "SUPER_ADMIN"), upload.array("images", 5), recordHandover);
router.post("/:id/cancel", cancelBooking);

module.exports = router;
