const express = require("express");
const router = express.Router();
const {
  sendOtpToEmail,
  verifyOtpAndSendPdf,
} = require("../controllers/equipmentDepotEmailController");

router.post("/send-otp", sendOtpToEmail);
router.post("/verify-otp", verifyOtpAndSendPdf);

module.exports = router;
