import { protect } from "../middleware/authmiddleware.js";
import { authorize } from "../middleware/authoriseRoleMiddleware.js";
import express from "express";
import validate from "../middleware/validate.js";
import { addTripValidator } from "../validations/trip.validation.js";
import { getData,
    addTrip,
    allTrips,
    cancelTrip
 } from "../controller/tripController.js";

const router = express.Router()


router.get("/data", protect, authorize("super_admin", "dc_manager"), getData)
router.post("/trip", protect, authorize("super_admin", "dc_manager"), addTripValidator, validate, addTrip)
router.get("/trips", protect, authorize("super_admin", "dc_manager"),allTrips)
router.put("/cancel/:id", protect, authorize("super_admin", "dc_manager"), cancelTrip)
export default router