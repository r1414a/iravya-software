import { protect } from "../middleware/authmiddleware.js";
import { authorize } from "../middleware/authoriseRoleMiddleware.js";
import express from "express";
import validate from "../middleware/validate.js";
import { getData,
    addTrip
 } from "../controller/tripController.js";

const router = express.Router()


router.get("/data", protect, authorize("super_admin", "dc_manager"), getData)
router.post("/trip", protect, authorize("super_admin", "dc_manager"), addTrip)
export default router