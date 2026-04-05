import { body } from "express-validator"

export const adddcValidation = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters"),

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

    body("contact_name")
        .notEmpty()
        .withMessage("Contact name is required"),

    body("contact_phone")
        .notEmpty()
        .withMessage("Contact phone is required")
        .isMobilePhone()
        .withMessage("Invalid phone number"),

    body("contact_email")
        .notEmpty()
        .withMessage("Contact email is required")
        .isEmail()
        .withMessage("Invalid email"),

    body("is_active")
        .optional()
        .isBoolean()
        .withMessage("is_active must be boolean")

];

export const updatedcValidation = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters"),

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

    body("contact_name")
        .notEmpty()
        .withMessage("Contact name is required"),

    body("contact_phone")
        .notEmpty()
        .withMessage("Contact phone is required")
        .isMobilePhone()
        .withMessage("Invalid phone number"),

    body("contact_email")
        .notEmpty()
        .withMessage("Contact email is required")
        .isEmail()
        .withMessage("Invalid email"),

    body("is_active")
        .optional()
        .isBoolean()
        .withMessage("is_active must be boolean")

];