import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sendResponse from "../utils/sendResponse.js";
import { getAllReportIssuesService } from "../services/reportIssues.service.js";

const getAllReportIssues = asyncHandler(async (req, res) => {
    let {limit, page, search, issue_type} = req.query
    console.log("requested user",req.user.role)
    const role = req.user.role
    // const {id, role} = req.user
    page   = parseInt(page)  || 1
    limit  = parseInt(limit) || 10
    search = search?.trim()  || null
    issue_type = issue_type  || null
    const issues = await getAllReportIssuesService({
    limit,
    page,
    user: {
        user_id: req.user?.id,
        user_role: role
    },
    search,
    issue_type
});
    sendResponse(res, 201, issues, "Reported issues data")
})
export{
    getAllReportIssues
}