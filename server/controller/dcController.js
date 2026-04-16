import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sendResponse from "../utils/sendResponse.js";

import { addDcService, 
    dcByNameExist,
    getDcByIdService,
    updateDcService,
    deleteDcService,
    getAllDcService,
    getUserDataService
 } from "../services/dcService.js";

const getUserData = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  const users = await getUserDataService({
    page: Number(page),
    limit: Number(limit),
    search,
  });

  sendResponse(res, 200, users, "User data");
});

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

const getAllDc = asyncHandler(async (req, res) => {
    let {
      page,
      limit,
      search,
      dc_status,
    } = req.query;

    // Defaults
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    search = search?.trim() || null;
    dc_status = dc_status || null;

    const dc = await getAllDcService(page,
      limit,
      search,
      dc_status)

    sendResponse(res, 201, dc, "Data found")

})

export{
    addDc,
    getDc,
    updateDc,
    deleteDc,
    getAllDc,
    getUserData
}