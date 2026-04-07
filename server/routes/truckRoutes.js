import upload from "../middleware/upload.js"
import { protect } from "../middleware/authmiddleware.js";
import { authorize } from "../middleware/authoriseRoleMiddleware.js";
import validate from "../middleware/validate.js";
import express from 'express'
import { addTruck,
    getTrukData,
    updateTruckData,
    deleteTruck,
    getRecentTripDetails,
    getTripHistory,
    getAllTruckData
 } from "../controller/truckController.js";
import {addTruckValidation,
    updateTruckValidation
} from "../validations/truck.validations.js"


const router = express.Router()

router.post(
  "/add-truck",
  protect,
  authorize('super_admin',"dc_manager"),
  upload.fields([
    { name: "registration_cert" },
    { name: "insurance_doc" },
    { name: "PUC_cert" }
  ]),
  addTruckValidation,
  validate,
  addTruck
)

router.get("/truck/:id", protect, authorize('super_admin',"dc_manager"),getTrukData)
router.put("/updatetruck/:id", protect, authorize('super_admin',"dc_manager"), upload.fields([
    { name: "registration_cert" },
    { name: "insurance_doc" },
    { name: "PUC_cert" }
  ]), updateTruckData, validate, updateTruckData)

router.delete("/truck/delete/:id", protect, authorize('super_admin',"dc_manager"),deleteTruck)
router.get("/trip-data", protect, authorize('super_admin',"dc_manager"), getRecentTripDetails)
router.get('/trip-history/:id', protect, authorize('super_admin',"dc_manager"),getTripHistory)
router.get("/truck", protect, authorize('super_admin',"dc_manager"), getAllTruckData)
export default router