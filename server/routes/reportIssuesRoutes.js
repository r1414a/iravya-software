import { protect } from "../middleware/authmiddleware.js";
import { authorize } from "../middleware/authoriseRoleMiddleware.js";
import express from "express";
import validate from "../middleware/validate.js";
import { getAllReportIssues } from "../controller/reportIssuesController.js";

const router = express.Router()

router.get("/reports", getAllReportIssues)

export default router