const BusinessList = require("../models/BusinessList");

const mongoose = require("mongoose");

// ✅ Add new business
exports.addBusiness = async (req, res) => {
  try {
    const data = req.body;

    // Create a new ObjectId
    const newBusiness = new BusinessList({
      _id: new mongoose.Types.ObjectId(),
      name: data.name,
      providerId: new mongoose.Types.ObjectId(data.providerId),
      mainCategoryId: new mongoose.Types.ObjectId(data.mainCategoryId),
      subCategoryId: new mongoose.Types.ObjectId(data.subCategoryId),
      rating: data.rating || 0,
      numRatings: data.numRatings || 0,
      status: data.status || "Not Verified",
      claimed: data.claimed || false,
      address: data.address,
      contactNumber: data.contact || "", // from frontend contact
      isOpen: data.isOpen ?? true,
      operatingHours: data.operatingHours || "9:00 AM - 11:00 PM",

      media: {
        mainImages: (data.images || []).map((url) => ({ url, alt: data.name })),
        totalPhotos: Number(data.totalPhotos) || 0,
        photoCategories: (data.photoCategories || []).map((c) => ({
          name: c.name || c,
          count: c.count || 0,
        })),
        videoTour: data.videoTour || "",
      },

      overview: {
        description: data.description,
        establishedYear: Number(data.establishedYear) || null,
        facilities: data.facilities || [],
        capacity: {
          minGuests: Number(data.capacity?.minGuests) || 0,
          maxGuests: Number(data.capacity?.maxGuests) || 0,
        },
        priceRange: data.priceRange || "",
        availableFor: data.availableFor || [],
        openingHours: data.operatingHours,
        website: data.website || "",
        email: data.email || "",
        occasion: data.occasions || [],
        contact: data.contact || "",
        exploreCategories: data.exploreCategories || [],
        relatedListings: data.relatedListings || [],
        faq: data.faq || [],
        services: data.services || [],
      },

      locationDetails: {
        address: data.address || "",
        area: data.area || "",
        city: data.city || "",
        pincode: data.pincode || "",
        landmark: data.landmark || "",
        mapLink: data.mapLink || "",
      },

      contactDetails: {
        phone: data.phone || "",
        whatsapp: data.whatsapp || "",
        email: data.email || "",
        ownerName: data.ownerName || "",
        verified: data.verified || false,
        gstin: data.gstin || "",
      },

      highlights: data.highlights || [],

      meta: {
        lastUpdated: new Date(),
        status: "Active",
        verifiedListing: false,
      },
    });

    const savedBusiness = await newBusiness.save();
    res.status(201).json({ message: "Business added successfully", business: savedBusiness });
  } catch (err) {
    console.error("Error adding business:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Fetch business details by ID
exports.getBusinessById = async (req, res) => {
  try {
    const { id } = req.params;
    const business = await BusinessList.findById(id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.status(200).json(business);
  } catch (err) {
    console.error("Error fetching business:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
