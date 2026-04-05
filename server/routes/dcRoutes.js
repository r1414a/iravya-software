import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { authorize } from "../middleware/authoriseRoleMiddleware.js";
import validate from "../middleware/validate.js";
import { addDc, 
    getDc,
    updateDc ,
    deleteDc
} from "../controller/dcController.js";

import { updatedcValidation, adddcValidation } from "../validations/dc.validation.js";

const router = express.Router()

router.post('/addDc',protect, authorize('super_admin', 'dc_manager'),updatedcValidation, validate, addDc)
router.get('/getDc/:id',protect, authorize('super_admin', 'dc_manager'), getDc)
router.put('/updatDc/:id', protect, authorize('super_admin', 'dc_manager'),updatedcValidation, validate, updateDc)
router.delete('/deleteDc/:id', protect, authorize('super_admin', 'dc_manager'), deleteDc)

export default router