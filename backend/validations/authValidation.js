const { body, validationResult } = require("express-validator");
const ApiError = require("../utils/apiError");

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return next(new ApiError(422, "Validation Error", extractedErrors));
  };
};

const registerValidation = validate([
  body("fullName").notEmpty().withMessage("Full name is required").trim(),
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters")
    .trim(),
  body("email").isEmail().withMessage("Must be a valid email address").normalizeEmail(),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Must be a valid 10-digit Indian phone number starting with 6-9"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
]);

const otpValidation = validate([
  body("otp")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),
]);

const baseLoginValidation = validate([
  body("login")
    .notEmpty()
    .withMessage("Email or Username or Phone is required"),
  body("password").notEmpty().withMessage("Password is required"),
]);

const loginValidation = (req, res, next) => {
  if (!req.body.login) {
    req.body.login = req.body.email || req.body.username || req.body.phone || req.body.phno || "";
  }
  return baseLoginValidation(req, res, next);
};

const forgotPasswordValidation = validate([
  body("email").isEmail().withMessage("Must be a valid email address"),
]);

const resetPasswordValidation = validate([
  body("email").isEmail().withMessage("Must be a valid email address"),
  body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
]);

module.exports = {
  registerValidation,
  otpValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
