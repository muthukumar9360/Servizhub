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
          from: "Businesses", // ✅ must match collection name
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

module.exports = router;
