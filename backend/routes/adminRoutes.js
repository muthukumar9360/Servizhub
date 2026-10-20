const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAuditLogs,
} = require("../controllers/adminController");
const { verifyJWT } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.use(verifyJWT, authorizeRoles("ADMIN", "SUPER_ADMIN"));

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.patch("/users/:userId/status", toggleUserStatus);
router.get("/audit-logs", getAuditLogs);

module.exports = router;
