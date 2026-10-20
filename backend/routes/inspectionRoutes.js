const express = require("express");
const router = express.Router();
const {
  createHandoverInspection,
  createReturnInspection,
  getInspectionsForBooking,
} = require("../controllers/inspectionController");
const { verifyJWT } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.use(verifyJWT);

router.post("/handover", authorizeRoles("PROVIDER", "ADMIN", "SUPER_ADMIN"), upload.array("images", 5), createHandoverInspection);
router.post("/return", authorizeRoles("PROVIDER", "ADMIN", "SUPER_ADMIN"), upload.array("images", 5), createReturnInspection);
router.get("/booking/:bookingId", getInspectionsForBooking);

module.exports = router;
