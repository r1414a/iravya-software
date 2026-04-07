import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import sendResponse from "../utils/sendResponse.js";
import { allBrandService } from "../services/brand.service.js";


const allBrand = asyncHandler(async (req, res) => {
    
    const brand = await allBrandService()
    if(brand){
        sendResponse(res, 201, brand, "Found Brand list")
    }
    else{
        throw new ApiError(400, "No data Found")
    }
})

export{
    allBrand
}