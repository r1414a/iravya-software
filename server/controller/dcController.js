import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sendResponse from "../utils/sendResponse.js";

import { addDcService, 
    dcByNameExist,
    getDcByIdService,
    updateDcService,
    deleteDcService
 } from "../services/dcService.js";


const addDc = asyncHandler(async(req, res)=>{
    const {name} = req.body
    const dcexist = await dcByNameExist(name)
    if(dcexist.length){
        // res.status(200)
        // .json(
        //     new ApiResponse(200, dc, "DC already exist")
        // )
        throw new ApiError(200, "DC already exist");
    }
    else{
        const dc = await addDcService(req.body)
        if(dc.length){
            // res.status(200)
            // .json(
            //     new ApiResponse(200, dc,"DC added successfully")
            // )
            sendResponse(res, 200, dc, "DC added successfully")

        }
    }
})

const getDc = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const dc = await getDcByIdService(id);
    if(dc.length){
        sendResponse(res, 201, dc, "Found DC")
    }
    else{
        throw new ApiError(200, "Could't found DC");
    } 
})

const updateDc = asyncHandler(async(req, res)=>{
    const  {id} = req.params;
    const dc = await updateDcService(id, req.body)
    if(dc.length){
        sendResponse(res, 201, dc, "DC is updated successfully")
    }
    else{
        throw new ApiError(200, "Could't found DC"); 
    }
})

const deleteDc = asyncHandler(async (req, res) => {
    const  {id} = req.params;
    const dc = await deleteDcService(id, req.body)
    if(dc.length){
        sendResponse(res, 201, dc, "DC is deleted successfully")
    }
    else{
        throw new ApiError(200, "Could't found DC"); 
    }
})

export{
    addDc,
    getDc,
    updateDc,
    deleteDc
}