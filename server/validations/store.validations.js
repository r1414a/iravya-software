import { body } from "express-validator";

const createStoreValidator = [
  body("brand_id")
    .notEmpty()
    .withMessage("Brand ID is required")
    .isUUID()
    .withMessage("Invalid Brand ID"),

  body("name")
    .notEmpty()
    .withMessage("Store name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Store name must be 2-100 characters"),

  body("address")
    .notEmpty()
    .withMessage("Address is required"),

  body("city")
    .notEmpty()
    .withMessage("City is required"),

  body("state")
    .notEmpty()
    .withMessage("State is required"),

  body("country")
    .notEmpty()
    .withMessage("Country is required"),

  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),

  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),

  body("manager_name")
    .notEmpty()
    .withMessage("Manager name is required")
    .isLength({ min: 2 })
    .withMessage("Manager name too short"),

  body("manager_phone")
    .notEmpty()
    .withMessage("Manager phone is required")
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  body("manager_email")
    .notEmpty()
    .withMessage("Manager email is required")
    .isEmail()
    .withMessage("Invalid email")
];

export{
    createStoreValidator
}