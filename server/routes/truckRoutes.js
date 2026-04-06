import upload from "../middleware/upload.js"
import { protect } from "../middleware/authmiddleware.js";
import { authorize } from "../middleware/authoriseRoleMiddleware.js";
import validate from "../middleware/validate.js";
import express from 'express'


const router = express.Router()



export default router