import { registerUser ,
    loginUser,
    logoutUser
} from "../controller/userController.js";
// import { protect } from "../middleware/authmiddleware";

import express from "express";
 

const router = express.Router()



//-------------Common Routs
router.post('/',registerUser);
router.post('/login',loginUser)

router.route("/logout").post(logoutUser)


export default router

