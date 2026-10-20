const express = require("express");
const router = express.Router();
const {
  getEquipments,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  getMyEquipments,
  getPendingEquipments,
  reviewEquipmentApproval,
} = require("../controllers/equipmentController");
const { verifyJWT } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { equipmentCreationValidation } = require("../validations/equipmentValidation");

// Public endpoints
router.get("/", getEquipments);
router.get("/:id", getEquipmentById);

// Authenticated Provider / Admin endpoints
router.get("/my/listings", verifyJWT, authorizeRoles("PROVIDER", "ADMIN", "SUPER_ADMIN"), getMyEquipments);
router.post(
  "/",
  verifyJWT,
  authorizeRoles("PROVIDER", "ADMIN", "SUPER_ADMIN"),
  upload.array("images", 5),
  equipmentCreationValidation,
  createEquipment
);
router.patch(
  "/:id",
  verifyJWT,
  authorizeRoles("PROVIDER", "ADMIN", "SUPER_ADMIN"),
  updateEquipment
);

// Admin Approval Routes
router.get(
  "/admin/pending",
  verifyJWT,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  getPendingEquipments
);
router.patch(
  "/:id/approval",
  verifyJWT,
  authorizeRoles("ADMIN", "SUPER_ADMIN"),
  reviewEquipmentApproval
);

module.exports = router;
