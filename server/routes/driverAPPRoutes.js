import { protect } from "../middleware/authmiddleware.js";
import { authorize } from "../middleware/authoriseRoleMiddleware.js";
import express from "express";
import validate from "../middleware/validate.js";

import { getDriverTrips,
    getCurrentTrip,
    confirmStopDelivery,
    acceptTrip,
    reportIssue,
    // confirmCompletionOfTrip
 } from "../controller/driverAPPContoller.js";



const router = express.Router()

router.get("/trips/:id", getDriverTrips)
router.get("/trip/:id", getCurrentTrip)
router.post("/confirmdelivery/:stop_id/:trip_id", confirmStopDelivery)
router.post("/accept/:trip_id",acceptTrip)
router.post("/report/:trip_id",reportIssue)
// router.post("/complet-trip/:trip_id", confirmCompletionOfTrip)



export default router