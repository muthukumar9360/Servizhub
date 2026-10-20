const express = require("express");
const router = express.Router();
const BusinessList = require("../models/BusinessList");

// 🔍 Search businesses by name / category / subcategory
router.get("/business", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q || !q.trim()) return res.json([]);

    const regex = new RegExp(q, "i");

    const results = await BusinessList.aggregate([
      {
        $lookup: {
          from: "Businesses",
          localField: "mainCategoryId",
          foreignField: "_id",
          as: "mainCat",
        },
      },
      { $unwind: { path: "$mainCat", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          subCat: {
            $filter: {
              input: "$mainCat.subCategories",
              as: "sub",
              cond: { $eq: ["$$sub._id", "$subCategoryId"] },
            },
          },
        },
      },
      { $unwind: { path: "$subCat", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $or: [
            { name: regex },
            { "mainCat.mainCategory": regex },
            { "subCat.title": regex },
          ],
        },
      },
      {
        $project: {
          name: 1,
          locationDetails: 1,
          mainCategoryName: "$mainCat.mainCategory",
          subCategoryName: "$subCat.title",
        },
      },
      { $limit: 10 },
    ]);

    res.json(results);
  } catch (err) {
    console.error("Search API error:", err);
    res.status(500).json({ message: "Search failed" });
  }
});

// Generic search fallback for /api/search?q=...
router.get("/", async (req, res) => {
  const q = req.query.q;
  if (!q || !q.trim()) return res.json([]);
  try {
    const regex = new RegExp(q, "i");
    const results = await BusinessList.find({
      $or: [{ name: regex }, { "contactDetails.city": regex }],
    }).limit(10);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Search error" });
  }
});

module.exports = router;
