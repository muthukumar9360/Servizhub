const BusinessCategory = require("../models/Business.js");
const BusinessList = require("../models/BusinessList.js")

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

    // find the category that contains this subcategory
    const category = await BusinessCategory.findOne({ "subCategories._id": id });
    if (!category) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    // extract the selected subcategory
    const subcategory = category.subCategories.id(id);

    // get other subcategories (exclude the selected one)
    const otherSubcategories = category.subCategories
      .filter(sub => sub._id.toString() !== id)
      .map(sub => ({
        _id: sub._id,
        title: sub.title,
        description: sub.description,
        image: sub.image,
        listings: sub.listings || [],
      }));

    // send response with selected subcategory, its listings, and other subcategories
    res.json({
      subcategory,
      listings: subcategory.listings || [],
      otherSubcategories,
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