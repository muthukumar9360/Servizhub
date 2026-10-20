const express = require("express");
const router = express.Router();
const {
  register,
  verifyEmailOtp,
  resendEmailOtp,
  verifyPhoneOtp,
  resendPhoneOtp,
  login,
  logout,
  logoutAll,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} = require("../controllers/authController");
const { verifyJWT } = require("../middleware/authMiddleware");
const { otpLimiter } = require("../middleware/rateLimiter");
const {
  registerValidation,
  otpValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../validations/authValidation");

// Public endpoints
router.post("/register", otpLimiter, registerValidation, register);
router.post("/verify-email", otpLimiter, otpValidation, verifyEmailOtp);
router.post("/resend-email-otp", otpLimiter, resendEmailOtp);
router.post("/verify-phone", otpLimiter, otpValidation, verifyPhoneOtp);
router.post("/resend-phone-otp", otpLimiter, resendPhoneOtp);
router.post("/login", loginValidation, login);
router.post("/refresh-token", refreshAccessToken);
router.post("/forgot-password", otpLimiter, forgotPasswordValidation, forgotPassword);
router.post("/reset-password", otpLimiter, resetPasswordValidation, resetPassword);

// Authenticated endpoints
router.post("/logout", verifyJWT, logout);
router.post("/logout-all", verifyJWT, logoutAll);
router.get("/me", verifyJWT, getCurrentUser);

module.exports = router;
