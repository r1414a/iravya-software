import { protect } from "../middleware/authmiddleware.js";
import { authorize } from "../middleware/authoriseRoleMiddleware.js";
import express from "express";

import validate from "../middleware/validate.js";
import { addDriver, 
    getDriver,
    updateDriver,
    deleteDriver,
    viewCurrentTripdetails,
    getDriverTripHistory,
    getAllDriverList,
    getAllDriverListBySearch
    
 } from "../controller/driver.controller.js";
import { addDriverValidation,
    updateDriverValidation
 } from "../validations/driver.validation.js";


const router = express.Router()

router.post("/addDriver",protect, authorize('super_admin',"dc_manager"),addDriverValidation, validate, addDriver )
router.get("/getDriver/:id", protect, authorize('super_admin',"dc_manager"), getDriver)
router.put("/updateDriver/:id", protect, authorize('super_admin',"dc_manager"), updateDriverValidation, validate, updateDriver)
router.delete("/deleteDriver/:id", protect, authorize('super_admin',"dc_manager"), deleteDriver)
router.get("/viewCurrentTripdetails/:id",protect, authorize('super_admin',"dc_manager"), viewCurrentTripdetails)
router.get("/getDriverTripHistory/:id", protect, authorize('super_admin',"dc_manager"),getDriverTripHistory)
router.get("/getAllDriverList", protect, authorize('super_admin',"dc_manager"), getAllDriverList)
router.post("/getAllDriverListBySearch", protect, authorize('super_admin',"dc_manager"), getAllDriverListBySearch)

export default router