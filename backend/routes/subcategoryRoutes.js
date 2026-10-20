const express = require("express");
const router = express.Router();
const { getUsersBySubcategory } = require("../controllers/subcategoryController");

router.get("/users/:subId", getUsersBySubcategory);

module.exports = router;