const express = require("express");
const router = express.Router();
const {
  scheduleMaintenance,
  getMaintenanceRecords,
  completeMaintenance,
} = require("../controllers/maintenanceController");
const { verifyJWT } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.use(verifyJWT, authorizeRoles("PROVIDER", "ADMIN", "SUPER_ADMIN"));

router.post("/", scheduleMaintenance);
router.get("/", getMaintenanceRecords);
router.patch("/:id/complete", completeMaintenance);

module.exports = router;
