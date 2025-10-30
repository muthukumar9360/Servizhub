const express = require("express");
const router = express.Router();
const { getUserProfileById,getUserProfileByIdBusiness } = require("../controllers/userController");

router.get("/:userId", getUserProfileById);
router.get("/business/:userId", getUserProfileByIdBusiness);

module.exports = router;