const User = require("../models/User");

const getSessionUser = async (req, res) => {
  try {
    if (req.session.user && req.session.user.username) {

      const user = await User.findOne({ username: req.session.user.username }).select("_id username email userType");
      if (!user) return res.status(404).json({ message: "User not found" });

      return res.json({ user });
    } else {
      return res.status(401).json({ message: "Not logged in" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const destroySession = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid"); 
    res.json({ message: "Logged out successfully" });
  });
};

module.exports = {
  getSessionUser,
  destroySession,
};
