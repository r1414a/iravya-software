import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import sendResponse from "../utils/sendResponse.js";
import { addStoreService ,
    storeExistByStoreCode,
    getStoreDataService,
    updateStoreService,
    deleteStoreService,
    deleveryDetailService,
    getAllStoreService,
    getUserDataService
} from "../services/store.service.js";


const getUserData = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;
    const users = await getUserDataService({page: Number(page),
    limit: Number(limit),
    search,})
    sendResponse(res, 200, users, "User data")
})

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

const getStoreData = asyncHandler(async(req, res)=>{
    const {id} = req.params

    const store = await getStoreDataService(id)

    if(store){
        sendResponse(res,201, store, "Store Data Found")
    }
    else{
        throw new ApiError(200, "Store Data not Found")
    }
})

const updateStore = asyncHandler(async (req, res) => {
    
    const {id} = req.params
    const store = await updateStoreService(id, req.body)
    if(store){
        sendResponse(res,201, store, "Store Data is updated successfully")
    }
    else{
        throw new ApiError(200, "Store does not exist")
    }
})

const deleteStore = asyncHandler(async(req, res)=>{
    const {id} = req.params
    const store = await deleteStoreService(id)
    if(store){
        sendResponse(res, 200, store, "Store is deleted successfully")
    }
    else{
        throw new ApiError(400, "Store not found")
    }
})

const deleveryDetails = asyncHandler(async (req, res) => {
    const {id} = req.params
    const trips = await deleveryDetailService(id)
    if(trips.length){
        sendResponse(res, 201, trips, "Data found")
    }
    else{
        sendResponse(res, 200,trips,"Data is not found")
    }
})


const getAllStores = asyncHandler(async (req, res) => {
    let {
      page,
      limit,
      search,
      brand_id,
      status,
      city
    } = req.query;

    // Defaults
    const user_id = req.user.id
    console.log(user_id)
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // Handle empty strings → null
    search = search?.trim() || null;
    brand_id = brand_id || null;
    status = status || null;
    city = city?.trim() || null;

    const stores = await getAllStoreService({
      page,
      limit,
      search,
      brand_id,
      status,
      city,
      user_id
    });

    sendResponse(res, 201, stores, "Data Found")

})





export{
    addStore,
    getStoreData,
    updateStore,
    deleteStore,
    deleveryDetails,
    getAllStores,
    getUserData
}