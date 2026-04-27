import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sendResponse from "../utils/sendResponse.js";
import { getAllReportIssuesService } from "../services/reportIssues.service.js";

const getAllReportIssues = asyncHandler(async (req, res) => {
    const issues = await getAllReportIssuesService()
    sendResponse(res, 201, issues, "Reported issues data")
})
export{
    getAllReportIssues
}