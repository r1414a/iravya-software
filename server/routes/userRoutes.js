import { registerUser ,
    loginUser,
    logoutUser,
    deleteUser,
    resetPassword
} from "../controller/userController.js";
import { protect } from "../middleware/authmiddleware.js";

import express from "express";

import validate from "../middleware/validate.js";

import {
  registerValidation,
  loginValidation,
  resetPasswordValidation
} from "../validations/auth.validation.js"
 

const router = express.Router()



//-------------Common Routs
router.post(
    "/signup",
    registerValidation,
    validate,
    registerUser
)

router.post(
    "/signin",
    loginValidation,
    validate,
    loginUser
)

router.post("/signout", protect, logoutUser);
router.delete("/delete_user/:id", protect, deleteUser)
router.delete("/reset_pass/:id", protect, resetPasswordValidation, validate, resetPassword)


export default router

