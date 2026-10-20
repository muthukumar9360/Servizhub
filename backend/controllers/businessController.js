const BusinessCategory = require("../models/Business.js");
const BusinessList = require("../models/BusinessList.js");
const mongoose = require("mongoose");

const getAllCategories = async (req, res) => {
  try {
    const categories = await BusinessCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategoryId = new mongoose.Types.ObjectId(id);

    // 1️⃣ Find category containing this subcategory
    const category = await BusinessCategory.findOne({
      "subCategories._id": subCategoryId
    });

    if (!category) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    // 2️⃣ Extract selected subcategory
    const subcategory = category.subCategories.id(subCategoryId);

    // 3️⃣ Fetch businesses from BusinessList
    const listings = await BusinessList.find(
      { subCategoryId },
      {
        name: 1,
        ratings: 1,
        tags: 1,
        media: 1,
        locationDetails: 1,
        contactDetails: 1,
        status: 1,
        claimed: 1,
        extraInfo: 1,
        isOpen: 1
      }
    );

    // 4️⃣ Other subcategories (no listings here)
    const otherSubcategories = category.subCategories
      .filter(sub => sub._id.toString() !== id)
      .map(sub => ({
        _id: sub._id,
        title: sub.title,
        image: sub.image
      }));

    // 5️⃣ Send response
    res.json({
      subcategory,
      listings,
      otherSubcategories
    });

  } catch (error) {
    console.error("Error fetching subcategory:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getBusinessByProviderId = async (req,res)=>{
  const {id} = req.params;
  const businesses = await BusinessList.find({providerId:id});
  res.json(businesses);
}

module.exports = { getAllCategories,getSubcategoryById,getBusinessByProviderId };