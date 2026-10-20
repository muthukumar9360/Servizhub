const express = require("express");
const router = express.Router();
const {
  requestReturn,
  completeReturnNoDamage,
  createDamageReport,
  getDamageReports,
  resolveDamageDispute,
} = require("../controllers/returnDamageController");
const { verifyJWT } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.use(verifyJWT);

// Return Endpoints
router.post("/:bookingId/request-return", requestReturn);
router.post("/:bookingId/complete-return", authorizeRoles("PROVIDER", "ADMIN", "SUPER_ADMIN"), completeReturnNoDamage);

// Damage Report Endpoints
router.post("/:bookingId/report-damage", authorizeRoles("PROVIDER", "ADMIN", "SUPER_ADMIN"), upload.array("evidence", 5), createDamageReport);
router.get("/damage-reports", getDamageReports);
router.patch("/damage-reports/:reportId/resolve", authorizeRoles("ADMIN", "SUPER_ADMIN"), resolveDamageDispute);

module.exports = router;
