import { protect } from "../middleware/authmiddleware.js";
import { authorize } from "../middleware/authoriseRoleMiddleware.js";
import express from "express";
import validate from "../middleware/validate.js";

import { getDriverTrips,
    getCurrentTrip,
    confirmStopDelivery
 } from "../controller/driverAPPContoller.js";

const router = express.Router()

router.get("/trips/:id", getDriverTrips)
router.get("/trip/:id", getCurrentTrip)
router.post("/confirmdelivery/:stop_id/:trip_id", confirmStopDelivery)




export default router