const UserDocument = require("../models/UserDocument");
const User = require("../models/User");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { uploadToCloudinary } = require("../config/cloudinary");
const fs = require("fs");

// Upload User KYC Document
const uploadDocument = asyncHandler(async (req, res) => {
  const { documentType } = req.body;
  if (!req.file) throw new ApiError(400, "Document image/file is required.");

  if (!["GOVERNMENT_ID", "ADDRESS_PROOF", "SELFIE"].includes(documentType)) {
    throw new ApiError(400, "Invalid document type.");
  }

  // Upload to Cloudinary
  const uploadResult = await uploadToCloudinary(req.file.path, "user_kyc_documents");

  // Clean local temp file
  if (fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
  }

  // Create or update document record
  const document = await UserDocument.create({
    user: req.user._id,
    documentType,
    documentUrl: uploadResult.url,
    cloudinaryPublicId: uploadResult.publicId,
    status: "PENDING",
  });

  return res.status(201).json(new ApiResponse(201, document, "Document uploaded successfully for verification."));
});

// Get Current User's Verification Documents
const getMyDocuments = asyncHandler(async (req, res) => {
  const documents = await UserDocument.find({ user: req.user._id });
  return res.status(200).json(new ApiResponse(200, documents, "User documents fetched"));
});

// ADMIN: Get Pending Verification Documents
const getPendingDocuments = asyncHandler(async (req, res) => {
  const documents = await UserDocument.find({ status: "PENDING" }).populate("user", "fullName email phone role");
  return res.status(200).json(new ApiResponse(200, documents, "Pending verification documents fetched"));
});

// ADMIN: Review Document (Approve / Reject)
const reviewDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { status, rejectionReason } = req.body;

  if (!["APPROVED", "REJECTED"].includes(status)) {
    throw new ApiError(400, "Status must be APPROVED or REJECTED.");
  }

  const document = await UserDocument.findById(documentId).populate("user");
  if (!document) throw new ApiError(404, "Document not found.");

  document.status = status;
  document.rejectionReason = status === "REJECTED" ? rejectionReason || "Document invalid or unreadable" : "";
  document.reviewedBy = req.user._id;
  document.reviewedAt = new Date();
  await document.save();

  // Check if all 3 required documents are APPROVED
  const userDocs = await UserDocument.find({ user: document.user._id, status: "APPROVED" });
  const approvedTypes = new Set(userDocs.map((d) => d.documentType));

  if (approvedTypes.has("GOVERNMENT_ID") && approvedTypes.has("ADDRESS_PROOF")) {
    await User.findByIdAndUpdate(document.user._id, {
      "verification.identityVerified": true,
      "verification.addressVerified": true,
      "verification.adminApproved": true,
    });

    await Notification.create({
      user: document.user._id,
      title: "KYC Account Verified!",
      message: "Your identity documents have been approved by administration. You are now fully verified on Servizio!",
      type: "ACCOUNT_VERIFIED",
    });
  }

  await AuditLog.create({
    actor: req.user._id,
    action: status === "APPROVED" ? "DOCUMENT_APPROVED" : "DOCUMENT_REJECTED",
    entityType: "UserDocument",
    entityId: document._id,
    metadata: { targetUserId: document.user._id, documentType: document.documentType, status, rejectionReason },
    ipAddress: req.ip,
  });

  return res.status(200).json(new ApiResponse(200, document, `Document ${status.toLowerCase()} successfully.`));
});

module.exports = {
  uploadDocument,
  getMyDocuments,
  getPendingDocuments,
  reviewDocument,
};
