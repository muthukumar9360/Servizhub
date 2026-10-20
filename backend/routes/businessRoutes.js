const express = require("express");
const { getAllCategories,getSubcategoryById,getBusinessByProviderId } = require("../controllers/businessController");

const router = express.Router();

router.get("/", getAllCategories);
router.get("/subcategory/:id", getSubcategoryById);
router.get("/:id",getBusinessByProviderId)

module.exports = router;