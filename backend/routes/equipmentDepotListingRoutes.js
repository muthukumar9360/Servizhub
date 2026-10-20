const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const BusinessList = require("../models/EquipmentDepotListing");

// GET business by ID
router.get("/:id", async (req, res) => {
  try {
    const business = await BusinessList.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });
    res.json(business);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ POST add new business
router.post("/add", async (req, res) => {
  try {
    const newBusiness = new BusinessList({
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    });

    const saved = await newBusiness.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error adding business:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
