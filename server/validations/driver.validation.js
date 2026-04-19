import { body } from "express-validator";

const addDriverValidation = [
    body("first_name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("First name must be at least 2 characters"),

    body("last_name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Last name must be at least 2 characters")
        ,

  body("phone_number")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  body("licence_no")
    .trim()
    .toUpperCase()
    .notEmpty()
    .withMessage("Licence number is required")
    .matches(/^[A-Z]{2}[- ]?[0-9]{2}[- ]?[0-9]{4}[- ]?[0-9]{7}$/)
    .withMessage("Invalid Indian driving licence number"),

  body("licence_class")
    .trim()
    .notEmpty()
    .withMessage("Licence class is required")
    .isIn(["LMV", "HMV", "HGMV", "HTV"])
    .withMessage("Invalid licence class"),

  body("licence_expiry")
    .notEmpty()
    .withMessage("Licence expiry date is required")
    .isISO8601()
    .withMessage("Invalid date format")
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error("Licence expiry must be future date");
      }
      return true;
    })
];

const updateDriverValidation = [
    body("first_name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("First name must be at least 2 characters"),

    body("last_name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Last name must be at least 2 characters")
        ,

  body("phone_number")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  body("licence_no")
    .trim()
    .toUpperCase()
    .notEmpty()
    .withMessage("Licence number is required")
    .matches(/^[A-Z]{2}[- ]?[0-9]{2}[- ]?[0-9]{4}[- ]?[0-9]{7}$/)
    .withMessage("Invalid Indian driving licence number"),

  body("licence_class")
    .trim()
    .notEmpty()
    .withMessage("Licence class is required")
    .isIn(["LMV", "HMV", "HGMV", "HTV"])
    .withMessage("Invalid licence class"),

  body("licence_expiry")
    .notEmpty()
    .withMessage("Licence expiry date is required")
    .isISO8601()
    .withMessage("Invalid date format")
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error("Licence expiry must be future date");
      }
      return true;
    })
];



export{
    addDriverValidation,
    updateDriverValidation
}