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

    return next(new ApiError(422, "Equipment Validation Error", extractedErrors));
  };
};

const equipmentCreationValidation = validate([
  body("name").notEmpty().withMessage("Equipment name is required").trim(),
  body("description").notEmpty().withMessage("Description is required"),
  body("category").notEmpty().withMessage("Category ID is required"),
  body("rentalPrice")
    .isNumeric()
    .withMessage("Rental price must be a valid number")
    .custom((val) => val >= 0)
    .withMessage("Rental price cannot be negative"),
  body("securityDeposit")
    .optional()
    .isNumeric()
    .withMessage("Security deposit must be a number"),
]);

module.exports = { equipmentCreationValidation };
