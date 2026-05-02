import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sendResponse from "../utils/sendResponse.js";
import crypto from 'crypto';
import { AlertDataService,
    MarkAsReadService,
    MarkAllAsReadService,
    deleteAlertService
 } from "../services/alertService.js";
import { log } from "console";

const AlertData= asyncHandler(async (req, res) => {
    let { type, severity, is_read, page, limit, search } = req.query;

    search = search?.trim() || null;
    type = type || null;
    severity = severity || null;

    // ✅ FIXED BOOLEAN
    is_read =
        is_read === undefined ? null : is_read === 'true';

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const user_id = req.user.id;
    const user_role = req.user.role;

    const data = await AlertDataService(
        type,
        severity,
        is_read,
        page,
        limit,
        search,
        user_id,
        user_role
    );

    sendResponse(res, 200, data, "Alert Data");

})

const MarkAsRead = asyncHandler(async (req, res) => {
    const {id} = req.params
    const markdata = await MarkAsReadService(id)
    if (!markdata) {
        throw new ApiError(404, "Alert not found");
    }

    sendResponse(res, 200, markdata, "Marked as read");

})

const MarkAllAsRead = asyncHandler(async (req, res) => {
    const { id, role } = req.user;

    const data = await MarkAllAsReadService(id, role);

    if (!data.length) {
        throw new ApiError(404, "No unread alerts found");
    }

    sendResponse(res, 200, {
        updated_count: data.length
    }, "Marked all as read");
})

const deleteAlert = asyncHandler(async (req, res) => {
    const {id} = req.params

    const alert = await deleteAlertService(id)
    if(!alert){
        throw new ApiError(404, "No alerts found");
    }
    sendResponse(res, 200, alert, "Deleted successfully")
})



export{
    AlertData,
    MarkAsRead,
    MarkAllAsRead,
    deleteAlert
    
}

