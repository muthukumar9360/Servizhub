const User = require("../models/User");

// ================= Normal Signup =================
const registerUser = async (req, res) => {
  const {
    firstname,
    lastname,
    phno,
    email,
    username,
    dob,
    userType,
    gender,
    password,
    confirmPassword,
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { phno }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User with same username, email, or phone already exists" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const newUser = new User({
      firstname,
      lastname,
      phno,
      email,
      username,
      dob,
      userType,
      gender,
      password,
      isGoogleAccount: false,
    });

    await newUser.save();

     // Save session
    req.session.user = {
      username: newUser.username,
      email: newUser.email,
      phno: newUser.phno,
      userId: newUser._id,
    };

    return res.status(201).json({ message: "OTP Verified...User registered successfully", user: newUser });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ================= Normal Login =================
const loginUser = async (req, res) => {
  const { username, email, phno, password } = req.body;

  try {
    // Find user where ALL fields match AND is NOT a Google account
    const user = await User.findOne({
      username,
      email,
      phno,
      isGoogleAccount: false, // ✅ exclude Google accounts
    });

    if (!user) {
      return res.status(404).json({ message: "User not found with these details" });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Set session
    req.session.user = {
      username: user.username,
      email: user.email,
      phno: user.phno,
      userId: user._id,
    };

    return res.json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= Google Signup =================
const googleSignup = async (req, res) => {
  const { googleId, email, firstname, lastname, username,dob,gender,phno,userType } = req.body;

  try {
    // Check if Google account already exists
    const existingUser = await User.findOne({ googleId, email });

    if (existingUser) {
      return res.status(409).json({ message: "Google account already exists, please login" });
    }

    const newUser = new User({
      firstname,
      lastname,
      phno,
      email,
      username,
      dob,
      userType,
      gender,
      isGoogleAccount: true,
      googleId,
    });

    await newUser.save();

    req.session.user = {
      username: newUser.username,
      email: newUser.email,
      phno: newUser.phno,
      userId: newUser._id,
    };

    return res.status(201).json({ message: "Google account registered successfully", user: newUser });
  } catch (error) {
    console.error("Google Signup Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= Google Login =================
const googleLogin = async (req, res) => {
  const { googleId, email } = req.body;

  try {
    const user = await User.findOne({ googleId, email, isGoogleAccount: true });

    if (!user) {
      return res.status(404).json({ message: "Google account not registered. Please sign up first." });
    }

    req.session.user = {
      username: user.username,
      email: user.email,
      phno: user.phno,
      userId: user._id,
    };

    return res.json({ message: "Google login successful", user });
  } catch (error) {
    console.error("Google Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, googleSignup, googleLogin };
