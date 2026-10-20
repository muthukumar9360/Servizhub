const express = require("express");
const { getGuides } = require("../controllers/guideController");

const router = express.Router();

router.get("/", getGuides);

module.exports = router;
