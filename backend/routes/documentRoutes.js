const express = require("express");
const router = express.Router();
const {
  uploadDocument,
  getMyDocuments,
  getPendingDocuments,
  reviewDocument,
} = require("../controllers/documentController");
const { verifyJWT } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.use(verifyJWT);

router.post("/upload", upload.single("document"), uploadDocument);
router.get("/my-documents", getMyDocuments);

// Admin routes
router.get("/pending", authorizeRoles("ADMIN", "SUPER_ADMIN"), getPendingDocuments);
router.patch("/:documentId/review", authorizeRoles("ADMIN", "SUPER_ADMIN"), reviewDocument);

module.exports = router;
