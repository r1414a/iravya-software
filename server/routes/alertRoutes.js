import { protect } from "../middleware/authmiddleware.js";
import { authorize } from "../middleware/authoriseRoleMiddleware.js";
import express from "express";
import validate from "../middleware/validate.js";
import { AlertData, 
    MarkAsRead ,
    MarkAllAsRead,
    deleteAlert
} from "../controller/alertController.js";

const router = express.Router()

router.get("/alerts", protect, authorize("dc_manager", "super_admin"), AlertData)
router.put("/alert/:id", protect, authorize("dc_manager", "super_admin"), MarkAsRead)
router.put("/mark-read", protect, authorize("dc_manager", "super_admin"), MarkAllAsRead)
router.delete("/delete/:id", protect, authorize("dc_manager", "super_admin"), deleteAlert)

export default router