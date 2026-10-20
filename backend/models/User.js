const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    phno: { type: String, unique: true, sparse: true }, // unique but optional
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    dob: { type: Date }, // optional for Google users
    userType: { type: String, enum: ["user", "provider"], default: "user" },
    gender: { type: String, enum: ["male", "female", "other"] },

    password: { type: String },

    googleId: { type: String, unique: true, sparse: true },
    isGoogleAccount: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema, "User");

module.exports = User;
