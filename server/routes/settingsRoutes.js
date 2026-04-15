import { protect } from "../middleware/authmiddleware.js";
import { authorize } from "../middleware/authoriseRoleMiddleware.js";
import express from "express";
import validate from "../middleware/validate.js";
import { setNotificationPreferences } from "../controller/settingsController.js";
const router = express.Router()

router.post("/notifications", protect, authorize('super_admin'), setNotificationPreferences)
export default router