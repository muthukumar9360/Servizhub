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

    return next(new ApiError(422, "Booking Validation Error", extractedErrors));
  };
};

const bookingCreationValidation = validate([
  body("equipmentId").notEmpty().withMessage("Equipment ID is required"),
  body("startDate")
    .isISO8601()
    .withMessage("Start date must be a valid ISO date"),
  body("endDate")
    .isISO8601()
    .withMessage("End date must be a valid ISO date")
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
]);

module.exports = { bookingCreationValidation };
