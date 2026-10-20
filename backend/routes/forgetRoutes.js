const express = require("express");
const { sendOtp, verifyOtp, changePassword } = require("../controllers/forgetController");
const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", changePassword);

module.exports = router;