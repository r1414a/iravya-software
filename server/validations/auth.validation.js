import { body } from "express-validator"

export const registerValidation = [
    body("first_name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("First name must be at least 2 characters"),

    body("last_name")
        .trim()
        ,

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
        .withMessage("Password must contain at least one uppercase letter and one special character"),

    body("role")
        .optional()
        .isIn(["super_admin", "dc_manager", "driver","store_manager"])
        .withMessage("Invalid role"),

    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isBoolean()
        .withMessage("Status must be boolean (true/false)")
]


export const loginValidation = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
]

export const resetPasswordValidation = [
    body("old_pass")
        .notEmpty()
        .withMessage("Old password is required")
        .isLength({ min: 6 })
        .withMessage("Old password must be at least 6 characters"),

    body("new_pass")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters")
]

export const setUserStatusValidator = [

    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isBoolean()
        .withMessage("Status must be boolean (true/false)")
]

export const updateUserValidation = [
    body("first_name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("First name must be at least 2 characters"),

    body("last_name")
        .trim()
        ,

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),


    body("role")
        .optional()
        .isIn(["super_admin", "dc_manager", "driver","store_manager"])
        .withMessage("Invalid role"),

    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isBoolean()
        .withMessage("Status must be boolean (true/false)")
]

export const setUserPasswordValidation =[
    body("new_password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
        .withMessage("Password must contain at least one uppercase letter and one special character"),
]