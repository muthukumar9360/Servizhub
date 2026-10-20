// routes/favourites.js
const express = require("express");
const saved = require("../models/SavedList.js");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { userId, businessId } = req.body;
    console.log(userId, businessId);
    if (!userId || !businessId)
      return res.status(400).json({ message: "Missing userId or businessId" });

    const exists = await saved.findOne({ userId, businessId });
    if (exists)
      return res.status(400).json({ message: "Already in favourites" });

    const newSaved = new saved({ userId, businessId });
    await newSaved.save();

    res.status(200).json({ message: "Added to favourites" });
  } catch (err) {
    console.error("Favourite add error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all saved items for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const savedList = await saved.find({ userId });
    res.status(200).json(savedList);
  } catch (err) {
    console.error("Error fetching saved list:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Remove from saved list
router.delete("/remove", async (req, res) => {
  try {
    const { userId, businessId } = req.body;
    await saved.deleteOne({ userId, businessId });
    res.status(200).json({ message: "Removed from saved list" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
