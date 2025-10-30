const mongoose = require("mongoose");

const businessListSchema = new mongoose.Schema(
  {
    _id:mongoose.Schema.Types.ObjectId,
    name: String,
    providerId: mongoose.Schema.Types.ObjectId,
    mainCategoryId: mongoose.Schema.Types.ObjectId,
    subCategoryId: mongoose.Schema.Types.ObjectId,
    rating: Number,
    numRatings: Number,
    status: String,
    claimed: Boolean,
    address: String,
    contactNumber: String,
    isOpen: Boolean,
    operatingHours: String,

    media: {
      mainImages: [
        {
          url: String,
          alt: String,
        },
      ],
      totalPhotos: Number,
      photoCategories: [
        {
          name: String,
          count: Number,
        },
      ],
      videoTour: String,
    },

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
      contact: String,
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

    locationDetails: {
      address: String,
      area: String,
      city: String,
      pincode: String,
      landmark: String,
      mapLink: String,
    },

    contactDetails: {
      phone: String,
      whatsapp: String,
      email: String,
      ownerName: String,
      verified: Boolean,
      gstin: String,
    },

    highlights: [String],

    reviews: {
      jdRating: Number,
      totalReviews: Number,
      userReviews: [
        {
          name: String,
          reviewsCount: Number,
          date: String,
          text: String,
          userImage: String,
          highlight: String,
        },
      ],
      alsoListedIn: [
        {
          category: String,
          count: String,
        },
      ],
    },

    meta: {
      lastUpdated: Date,
      status: String,
      verifiedListing: Boolean,
    },
  },
  { collection: "Businesslist" }
);

module.exports = mongoose.model("BusinessList", businessListSchema,"Businesslist");
