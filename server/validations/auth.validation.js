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
        .withMessage("Password must be at least 6 characters"),

    body("role")
        .optional()
        .isIn(["super_admin", "dc_manager", "driver","store_manager"])
        .withMessage("Invalid role"),

    body("status")
        .optional()
        .isIn(["TRUE", "FALSE"])
        .withMessage("Invalid status")
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