import { registerUser ,
    loginUser,
    logoutUser,
    deleteUser,
    resetPassword,
    setUserStatus
} from "../controller/userController.js";
import { protect } from "../middleware/authmiddleware.js";
import { authorize } from "../middleware/authoriseRoleMiddleware.js";
import { authorizeSihnin } from "../middleware/authoriseSigninMiddleware.js";
import express from "express";

import validate from "../middleware/validate.js";

import {
  registerValidation,
  loginValidation,
  resetPasswordValidation,
  setUserStatusValidator,
 
} from "../validations/auth.validation.js"
 

const router = express.Router()



//-------------Common Routs
router.post(
    "/signup",
    protect,
    authorize('super_admin'),
    registerValidation,
    validate,
    registerUser
)

router.post(
    "/signin",
    
    loginValidation,
    validate,
    authorizeSihnin(true),
    loginUser
)

router.post("/signout", protect, logoutUser);
router.delete("/delete_user/:id",protect, authorize('super_admin'), protect, deleteUser)
router.post("/reset_pass/:id",protect,authorize('super_admin'), resetPasswordValidation, validate, resetPassword)
router.put("/change_user_status/:id",protect, authorize('super_admin'),setUserStatusValidator, validate, setUserStatus)


export default router

