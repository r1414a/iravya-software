import { protect } from "../middleware/authmiddleware.js";
import { authorize } from "../middleware/authoriseRoleMiddleware.js";
import express from "express";
import validate from "../middleware/validate.js";
import { addStore,
    getStoreData,
    updateStore,
    deleteStore,
    deleveryDetails,
    getAllStores,
    getUserData
 } from "../controller/storeController.js";
import { createStoreValidator,
    updateStoreValidation
 } from "../validations/store.validations.js";


const router = express.Router()

router.post("/stores", protect, authorize('super_admin',"dc_manager"), createStoreValidator, validate, addStore)
router.get("/store/:id", protect, authorize('super_admin',"dc_manager"), getStoreData)
router.put("/store/:id", protect, authorize('super_admin',"dc_manager"), updateStoreValidation, validate,updateStore)
router.delete("/store/:id", protect, authorize('super_admin',"dc_manager"), deleteStore)
router.get("/store-deliveries/:id", protect, authorize('super_admin',"dc_manager"),deleveryDetails)
router.get("/stores", protect, authorize('super_admin',"dc_manager"), getAllStores)
router.get("/managers",protect, authorize('super_admin',"dc_manager"), getUserData)
export default router
