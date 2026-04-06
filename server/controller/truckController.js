import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import sendResponse from "../utils/sendResponse.js";
import { addTruckservice } from "../services/truck.services.js";

const addTruck = asyncHandler(async(req,res)=>{

    const truck = await addTruckservice(req.body)
    if(truck.length>0){
        sendResponse(res,200, truck, "Truck data is added successs=fully")
    }
    
})

export{
    addTruck
}