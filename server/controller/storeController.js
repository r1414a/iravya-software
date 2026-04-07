import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import sendResponse from "../utils/sendResponse.js";
import { addStoreService ,
    storeExistByStoreCode
} from "../services/store.service.js";

const addStore = asyncHandler(async(req, res)=>{

    const {store_code } = req.body
    const existSTore = await storeExistByStoreCode(store_code)
    if(existSTore){
        sendResponse(res, 200, {is_exist: existSTore}, "Store data is already added")
    }
    const store = await addStoreService(req.body)
    if(store){
        sendResponse(res, 200, store, "Store data is added successfully")
    }
    

})





export{
    addStore
}