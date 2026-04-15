import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import sendResponse from "../utils/sendResponse.js";
import { setNotificationPreferencesService } from "../services/settings.service.js";

const setNotificationPreferences = asyncHandler(async (req, res) => {
    const {id} = req.user
    const settup = await setNotificationPreferencesService(id, req.body)
    sendResponse(res, 200, settup, "Notification preferences are updated")
})




export{
    setNotificationPreferences
}