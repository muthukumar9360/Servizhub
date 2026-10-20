const mongoose = require("mongoose");

const businessListSchema = new mongoose.Schema(
  {
    // BASIC
    name: { type: String, required: true },

    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },

    mainCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessCategory",
      index: true,
      required: true,
    },

    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      required: true,
    },

    // RATINGS
    ratings: {
      overall: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },

    status: { type: String, default: "Not Verified" },
    claimed: { type: Boolean, default: false },
    isOpen: { type: Boolean, default: true },
    operatingHours: String,
    extraInfo: String,

    // MEDIA
    media: {
      mainImages: [
        {
          url: String,
          alt: String,
        },
      ],
      totalPhotos: Number,

      categories: [
        {
          name: String,
          images: { type: Array, default: [] },
          count: Number,
        },
      ],

      video: String,
    },

    // OVERVIEW
    overview: {
      description: String,
      establishedYear: Number,
      facilities: [String],

      capacity: {
        minGuests: Number,
        maxGuests: Number,
      },

      priceRange: String,
      availableFor: [String],
      openingHours: String,
      closedDays: String,
      website: String,
      email: String,

      occasion: [String],
      banquetType: [String],

      addressDetails: {
        name: String,
        line2: String,
      },

      exploreCategories: [String],

      relatedListings: [
        {
          name: String,
          rating: Number,
          reviews: Number,
          distance: String,
          location: String,
          verified: Boolean,
          trust: Boolean,
          imageUrl: String,
        },
      ],

      faq: [
        {
          q: String,
          a: String,
        },
      ],

      services: [String],
    },

    // LOCATION
    locationDetails: {
      address: String,
      area: String,
      city: String,
      pincode: String,
      landmark: String,
      mapLink: String,
    },

    // CONTACT
    contactDetails: {
      phone: String,
      whatsapp: String,
      email: String,
      ownerName: String,
      verified: Boolean,
      gstin: String,
    },

    highlights: [String],

    // REVIEWS
    reviews: {
      alsoListedIn: [
        {
          category: String,
          count: String,
        },
      ],
      list: [
        {
          name: String,
          reviewsCount: Number,
          date: String,
          text: String,
          userImage: String,
          highlight: String,
        },
      ],
    },

    // META
    meta: {
      lastUpdated: { type: Date, default: Date.now },
      status: { type: String, default: "Active" },
      verifiedListing: { type: Boolean, default: false },
    },

    tags: [String],
  },
  {
    collection: "Businesslist",
    timestamps: true,
  }
);

module.exports = mongoose.model("BusinessList", businessListSchema);
