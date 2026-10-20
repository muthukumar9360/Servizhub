const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
} = require("../controllers/categoryController");
const { verifyJWT } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Admin Management
router.post("/", verifyJWT, authorizeRoles("ADMIN", "SUPER_ADMIN"), createCategory);
router.patch("/:id", verifyJWT, authorizeRoles("ADMIN", "SUPER_ADMIN"), updateCategory);

module.exports = router;
