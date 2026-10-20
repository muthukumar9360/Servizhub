const mongoose = require("mongoose");

const UserListSchema = new mongoose.Schema({
  name: { type: String, required: true },         // Full name of provider
  username: { type: String, required: true },     // Unique username
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },   // Links to main service
  subcategoryId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Links to subcategory _id inside service
  description: { type: String },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  completedProjects: { type: Number, default: 0 },
  skills: [String],                               // List of skills
  image: { type: String },                        // Profile picture
  location: { type: String },                     // City/Region
  experience: { type: Number, default: 0 },       // Years of experience
  availability: { type: String, default: "Available" }, // Available / Busy

  // 📌 New fields
  phone: { type: String },
  email: { type: String },

  education: [
    {
      degree: { type: String },
      institution: { type: String },
      year: { type: Number }
    }
  ],

  projects: [
    {
      title: { type: String },
      description: { type: String },
      link: { type: String }
    }
  ],

  reviews: [
    {
      reviewer: { type: String },
      comment: { type: String },
      rating: { type: Number, default: 0 }
    }
  ],

  languages: [String],   // e.g. ["English", "Hindi"]

  // Social Links
  linkedin: { type: String },
  github: { type: String },
  website: { type: String }
},
{ timestamps: true }  // adds createdAt & updatedAt automatically
);

module.exports = mongoose.model("UserList", UserListSchema, "servicelist");
