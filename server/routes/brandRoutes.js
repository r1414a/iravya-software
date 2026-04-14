import { protect } from "../middleware/authmiddleware.js";
import { authorize } from "../middleware/authoriseRoleMiddleware.js";
import express from "express";
import validate from "../middleware/validate.js";

import { allBrand } from "../controller/brandController.js";


const router = express.Router()

router.get("/", protect, authorize('super_admin',"dc_manager"), allBrand)


export default router