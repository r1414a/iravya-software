import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import sendResponse from "../utils/sendResponse.js";
import { addDriverService, 
    driverExistBylicenceno, 
    getDriverbyidService,
    updateDriverService,
    deleteDriverService ,
    getDriverCurrentTrip,
    getDriverTripHistoryService,
    getDriversListService,
    getDriversListeBySearchService
} from "../services/driver.services.js";

const addDriver = asyncHandler(async (req, res) => {
    const {licence_no} = req.body
    const exist_driver = await driverExistBylicenceno(licence_no)

    if(exist_driver.length){
        sendResponse(res, 200 ,exist_driver, "Driver already added")
    }
    const driver = await addDriverService(req.body)
    if(driver.length){
        sendResponse(res, 200, driver, "Driver data is added successfully")
    }
})

const getDriver = asyncHandler(async(req, res)=>{
    const {id} = req.params
    const driver = await getDriverbyidService(id)

    if(driver.length){
        sendResponse(res, 201, driver, "Found driver data")
    }
    else{
        sendResponse(res, 201, driver, "could not find driver data")
    }
})

const updateDriver = asyncHandler(async (req,res) => {
    const {id} = req.params
    const driver = await updateDriverService(id, req.body)

    if(driver.length){
        sendResponse(res, 200, driver, "Driver data updated successfully")
    }
    else{
        throw new ApiError(200, "could not find driver")
    }
})

const deleteDriver = asyncHandler(async (req, res) => {
    const {id} = req.params
    const driver = await deleteDriverService(id)
    if(driver.length){
        sendResponse(res, 200, driver, "Driver is deleted successfully")
    }
    else{
        throw new ApiError(200, "could not find driver")
    }
})

const viewCurrentTripdetails = asyncHandler(async (req, res) => {
    const {id} = req.params
    const trip = await getDriverCurrentTrip(id)
    console.log(trip)
    if(trip.length){
        sendResponse(res, 201, trip, "Todays current trip")
    }
    else{
        throw new ApiError(200, "No data found")
    }
})

const getDriverTripHistory = asyncHandler(async (req, res) => {
    const {id} = req.params
    const trips = await getDriverTripHistoryService(id)
    if(trips.length){
        sendResponse(res, 201, trips, "Data Found")
    }
    else{
        throw new ApiError(200, "No data found")
    }
})

const getAllDriverList = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const drivers = await getDriversListService(
        Number(page),
        Number(limit)
    );

    sendResponse(
        res,
        200,
        drivers,
        "Drivers fetched successfully"
    );
});

const getAllDriverListBySearch = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10  } = req.params;
  const {search = "" } = req.body

  const drivers = await getDriversListeBySearchService(
    Number(page),
    Number(limit),
    search
  );

  sendResponse(res, 200, drivers, "Drivers fetched successfully");
});



export{
    addDriver,
    getDriver,
    updateDriver,
    deleteDriver,
    viewCurrentTripdetails,
    getDriverTripHistory,
    getAllDriverList,
    getAllDriverListBySearch
    
}