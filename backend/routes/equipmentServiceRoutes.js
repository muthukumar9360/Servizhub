const express = require("express");
const { getServices,getServiceById } = require("../controllers/equipmentServiceController");

const router = express.Router();

router.get("/", getServices);

router.get("/:id", getServiceById);

module.exports = router;
