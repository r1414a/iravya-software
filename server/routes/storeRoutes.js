import { protect } from "../middleware/authmiddleware.js";
import { authorize } from "../middleware/authoriseRoleMiddleware.js";
import express from "express";
import validate from "../middleware/validate.js";
import { addStore } from "../controller/storeController.js";
import { createStoreValidator } from "../validations/store.validations.js";

const router = express.Router()

router.post("/stores", protect, authorize('super_admin',"dc_manager"), createStoreValidator, validate, addStore)
export default router
