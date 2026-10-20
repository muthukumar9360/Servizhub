const EquipmentCategory = require("../models/EquipmentCategory");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

// Public: Get all active categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await EquipmentCategory.find({ isActive: true });
  return res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

// Public: Get category by ID
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await EquipmentCategory.findById(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");
  return res.status(200).json(new ApiResponse(200, category, "Category details retrieved"));
});

// Admin: Create Category
const createCategory = asyncHandler(async (req, res) => {
  const { mainCategory, description, homeImage, subCategories } = req.body;

  const existing = await EquipmentCategory.findOne({ mainCategory });
  if (existing) throw new ApiError(409, "Category name already exists");

  const slug = mainCategory.toLowerCase().replace(/[^a-z0-9]/g, "-");

  const category = await EquipmentCategory.create({
    mainCategory,
    slug,
    description: description || "",
    homeImage: homeImage || "",
    subCategories: subCategories || [],
    isActive: true,
  });

  return res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
});

// Admin: Update Category
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await EquipmentCategory.findByIdAndUpdate(id, req.body, { new: true });
  if (!category) throw new ApiError(404, "Category not found");

  return res.status(200).json(new ApiResponse(200, category, "Category updated successfully"));
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
};
