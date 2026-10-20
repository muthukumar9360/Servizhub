// routes/favourites.js
const express = require("express");
const Favourite = require("../models/FavouriteList.js");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { userId, businessId } = req.body;
    console.log(userId, businessId);
    if (!userId || !businessId)
      return res.status(400).json({ message: "Missing userId or businessId" });

    const exists = await Favourite.findOne({ userId, businessId });
    if (exists)
      return res.status(400).json({ message: "Already in favourites" });

    const newFav = new Favourite({ userId, businessId });
    await newFav.save();

    res.status(200).json({ message: "Added to favourites" });
  } catch (err) {
    console.error("Favourite add error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all favourites for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const favourites = await Favourite.find({ userId });
    res.status(200).json(favourites);
  } catch (err) {
    console.error("Error fetching favourites:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Remove from favourites
router.delete("/remove", async (req, res) => {
  try {
    const { userId, businessId } = req.body;
    await Favourite.deleteOne({ userId, businessId });
    res.status(200).json({ message: "Removed from favourites" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
