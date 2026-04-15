import { registerUser ,
    getMe,
    loginUser,
    logoutUser,
    deleteUser,
    resetPassword,
    setUserStatus,
    getAllUser,
    getUserID,
    updateUser,
    getUserbySearch,
    setUserPassword
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
 updateUserValidation,
 setUserPasswordValidation
} from "../validations/auth.validation.js"
 

const router = express.Router()

router.get("/me", protect, getMe)

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
    // protect,
    loginValidation,
    validate,
    // authorizeSihnin(true),
    loginUser
)

router.post("/signout", protect, logoutUser);
router.delete("/delete_user/:id",protect, authorize('super_admin'), protect, deleteUser)
router.post("/reset_pass/:id",protect,authorize('super_admin'), resetPasswordValidation, validate, resetPassword)
router.put("/change_user_status/:id",protect, authorize('super_admin'),setUserStatusValidator, validate, setUserStatus)
router.put("/update_user/:id", protect, authorize('super_admin'), updateUserValidation, validate, updateUser)
router.get("/all_users",protect, authorize('super_admin'), getAllUser)
router.get("/user/:id",protect, authorize('super_admin'), getUserID)
router.post("/users_by_search",protect, authorize('super_admin'), getUserbySearch)
router.post("/password",protect, authorize('super_admin'),setUserPasswordValidation, validate, setUserPassword)

export default router

