import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sendResponse from "../utils/sendResponse.js";
import crypto from 'crypto';
import { getCountDataService } from "../services/analytics.service.js";


const getCountData = asyncHandler(async (req,res) => {
    const {id, role} = req.user
    const data = await getCountDataService(id, role)
    console.log(data)
    if(data){
        sendResponse(res, 201, data, "Count Data")
    }else{
        throw new ApiError(400, "Bad request")
    }
})

export{
    getCountData
}
