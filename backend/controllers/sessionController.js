const User = require("../models/User");
const jwt = require("jsonwebtoken");

const getSessionUser = async (req, res) => {
  try {
    if (req.session && req.session.user && req.session.user.username) {
      const user = await User.findOne({ username: req.session.user.username }).select("_id fullName username email role userType");
      if (user) return res.json({ user });
    }

    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select("_id fullName username email role userType");
        if (user) return res.json({ user });
      } catch (err) {
        // Token expired or invalid
      }
    }

    return res.status(401).json({ message: "Not logged in" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const destroySession = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.clearCookie("connect.sid");
  if (req.session) {
    req.session.destroy(() => {});
  }
  return res.json({ message: "Logged out successfully" });
};

module.exports = {
  getSessionUser,
  destroySession,
};
