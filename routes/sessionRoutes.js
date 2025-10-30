const express = require("express");
const router = express.Router();
const { getSessionUser,destroySession } = require("../controllers/sessionController");

// ✅ Get session user
router.get("/me", getSessionUser);
// ✅ Logout (destroy session)
router.post("/logout", destroySession);

module.exports = router;
