const EquipmentListing = require("../models/EquipmentListing");
const EquipmentCategory = require("../models/EquipmentCategory");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { uploadToCloudinary, deleteFromCloudinary } = require("../config/cloudinary");
const fs = require("fs");

// 1. GET ALL EQUIPMENTS (Search, Filter, Pagination)
const getEquipments = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    city,
    minPrice,
    maxPrice,
    condition,
    availabilityStatus,
    rating,
    page = 1,
    limit = 12,
    sort = "createdAt",
    order = "desc",
  } = req.query;

  const query = {
    approvalStatus: "APPROVED", // Public only sees approved equipment
  };

  if (q) {
    query.$text = { $search: q };
  }

  if (category) {
    query.category = category;
  }

  if (city) {
    query["location.city"] = { $regex: city, $options: "i" };
  }

  if (minPrice || maxPrice) {
    query.rentalPrice = {};
    if (minPrice) query.rentalPrice.$gte = Number(minPrice);
    if (maxPrice) query.rentalPrice.$lte = Number(maxPrice);
  }

  if (condition) {
    query.condition = condition;
  }

  if (availabilityStatus) {
    query.availabilityStatus = availabilityStatus;
  } else {
    query.availabilityStatus = { $ne: "INACTIVE" };
  }

  if (rating) {
    query.averageRating = { $gte: Number(rating) };
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  const sortOrder = order === "asc" ? 1 : -1;
  const sortOptions = { [sort]: sortOrder };

  const [equipments, total] = await Promise.all([
    EquipmentListing.find(query)
      .populate("category", "mainCategory subCategories")
      .populate("owner", "fullName email phone profileImage rating")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum),
    EquipmentListing.countDocuments(query),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        equipments,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      "Equipment listings fetched successfully"
    )
  );
});

// 2. GET EQUIPMENT DETAILS BY ID / SLUG
const getEquipmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const equipment = await EquipmentListing.findById(id)
    .populate("category", "mainCategory subCategories")
    .populate("owner", "fullName email phone profileImage status verification");

  if (!equipment) throw new ApiError(404, "Equipment not found.");

  return res.status(200).json(new ApiResponse(200, equipment, "Equipment details retrieved"));
});

// 3. CREATE EQUIPMENT (Provider / Admin)
const createEquipment = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    subCategoryId,
    brand,
    modelName,
    specifications,
    condition,
    rentalPrice,
    pricingType,
    securityDeposit,
    quantity,
    address,
    city,
    state,
    pincode,
    pickupInstructions,
    deliveryAvailable,
    deliveryCharge,
  } = req.body;

  const categoryDoc = await EquipmentCategory.findById(category);
  if (!categoryDoc) throw new ApiError(404, "Selected equipment category not found.");

  const slug = `${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`;

  // Handle uploaded images if any
  const images = [];
  if (req.files && req.files.length > 0) {
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const result = await uploadToCloudinary(file.path, "equipment_images");
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      images.push({
        url: result.url,
        publicId: result.publicId,
        isPrimary: i === 0,
        order: i,
      });
    }
  } else {
    // Default fallback equipment image
    images.push({
      url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80",
      publicId: "",
      isPrimary: true,
      order: 0,
    });
  }

  // Parse specs if passed as string JSON
  let parsedSpecs = [];
  if (typeof specifications === "string") {
    try {
      parsedSpecs = JSON.parse(specifications);
    } catch (e) {
      parsedSpecs = [];
    }
  } else if (Array.isArray(specifications)) {
    parsedSpecs = specifications;
  }

  const equipment = await EquipmentListing.create({
    name,
    slug,
    description,
    category,
    subCategoryId: subCategoryId || categoryDoc.subCategories[0]?._id,
    owner: req.user._id,
    brand: brand || "",
    modelName: modelName || "",
    specifications: parsedSpecs,
    images,
    condition: condition || "EXCELLENT",
    rentalPrice: Number(rentalPrice),
    pricingType: pricingType || "PER_DAY",
    securityDeposit: Number(securityDeposit || 0),
    quantity: Number(quantity || 1),
    location: {
      address: address || "",
      city: city || "Chennai",
      state: state || "Tamil Nadu",
      pincode: pincode || "",
    },
    pickupInstructions: pickupInstructions || "Pick up available at depot location.",
    deliveryAvailable: deliveryAvailable === true || deliveryAvailable === "true",
    deliveryCharge: Number(deliveryCharge || 0),
    approvalStatus: req.user.role === "ADMIN" || req.user.role === "SUPER_ADMIN" ? "APPROVED" : "PENDING_APPROVAL",
    availabilityStatus: "AVAILABLE",
  });

  await AuditLog.create({
    actor: req.user._id,
    action: "EQUIPMENT_CREATED",
    entityType: "EquipmentListing",
    entityId: equipment._id,
    metadata: { name: equipment.name, rentalPrice: equipment.rentalPrice },
    ipAddress: req.ip,
  });

  return res.status(201).json(new ApiResponse(201, equipment, "Equipment listing submitted successfully."));
});

// 4. UPDATE EQUIPMENT
const updateEquipment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const equipment = await EquipmentListing.findById(id);

  if (!equipment) throw new ApiError(404, "Equipment not found.");

  // Check authorization: Owner or Admin
  if (
    equipment.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "ADMIN" &&
    req.user.role !== "SUPER_ADMIN"
  ) {
    throw new ApiError(403, "You are not authorized to update this equipment.");
  }

  const allowedUpdates = [
    "name",
    "description",
    "brand",
    "modelName",
    "condition",
    "rentalPrice",
    "securityDeposit",
    "availabilityStatus",
    "quantity",
    "location",
    "pickupInstructions",
    "deliveryAvailable",
    "deliveryCharge",
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      equipment[field] = req.body[field];
    }
  });

  await equipment.save();

  return res.status(200).json(new ApiResponse(200, equipment, "Equipment updated successfully."));
});

// 5. GET PROVIDER'S OWN EQUIPMENTS
const getMyEquipments = asyncHandler(async (req, res) => {
  const equipments = await EquipmentListing.find({ owner: req.user._id })
    .populate("category", "mainCategory")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, equipments, "Provider equipment listings retrieved"));
});

// 6. ADMIN: GET PENDING EQUIPMENTS
const getPendingEquipments = asyncHandler(async (req, res) => {
  const equipments = await EquipmentListing.find({ approvalStatus: "PENDING_APPROVAL" })
    .populate("category", "mainCategory")
    .populate("owner", "fullName email phone role");

  return res.status(200).json(new ApiResponse(200, equipments, "Pending equipment approvals fetched"));
});

// 7. ADMIN: APPROVE / REJECT EQUIPMENT
const reviewEquipmentApproval = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { approvalStatus, rejectionReason } = req.body;

  if (!["APPROVED", "REJECTED"].includes(approvalStatus)) {
    throw new ApiError(400, "Status must be APPROVED or REJECTED.");
  }

  const equipment = await EquipmentListing.findById(id);
  if (!equipment) throw new ApiError(404, "Equipment listing not found.");

  equipment.approvalStatus = approvalStatus;
  equipment.rejectionReason = approvalStatus === "REJECTED" ? rejectionReason || "Does not meet guidelines" : "";
  await equipment.save();

  await Notification.create({
    user: equipment.owner,
    title: `Equipment Listing ${approvalStatus}!`,
    message: `Your equipment listing '${equipment.name}' has been ${approvalStatus.toLowerCase()}.`,
    type: approvalStatus === "APPROVED" ? "EQUIPMENT_APPROVED" : "EQUIPMENT_REJECTED",
  });

  await AuditLog.create({
    actor: req.user._id,
    action: approvalStatus === "APPROVED" ? "EQUIPMENT_APPROVED" : "EQUIPMENT_REJECTED",
    entityType: "EquipmentListing",
    entityId: equipment._id,
    metadata: { approvalStatus, rejectionReason },
    ipAddress: req.ip,
  });

  return res.status(200).json(new ApiResponse(200, equipment, `Equipment ${approvalStatus.toLowerCase()} successfully.`));
});

module.exports = {
  getEquipments,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  getMyEquipments,
  getPendingEquipments,
  reviewEquipmentApproval,
};
