const express = require("express");
const { sendOtp, verifyOtp, resendOtp } = require("../controllers/otpController");
const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

module.exports = router;

//wonderful world
