import { protect } from "../middleware/authmiddleware.js";
import { authorize } from "../middleware/authoriseRoleMiddleware.js";
import express from "express";
import validate from "../middleware/validate.js";
import { getCountData } from "../controller/analyticsController.js";

const router = express.Router()

router.get("/count", protect, authorize("super_admin", "dc_manageer"), getCountData)
export default router