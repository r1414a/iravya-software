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
        return sendResponse(res, 200 ,exist_driver, "Driver already added")
    }
    const driver = await addDriverService(req.body)
    if(driver.length){
        return sendResponse(res, 200, driver, "Driver data is added successfully")
    }

    throw new ApiError(500, "Failed to add driver");
})

const getDriver = asyncHandler(async(req, res)=>{
    const {id} = req.params
    const driver = await getDriverbyidService(id)

    if (driver.length) {
        return sendResponse(res, 200, driver, "Driver found");
    }
    throw new ApiError(404, "Driver not found");
})

const updateDriver = asyncHandler(async (req,res) => {
    const {id} = req.params
    const driver = await updateDriverService(id, req.body)

    if (driver && driver.length > 0) {
        return sendResponse(res, 200, driver[0], "Driver updated successfully");
    }
    throw new ApiError(404, "Driver not found");
})

const deleteDriver = asyncHandler(async (req, res) => {
    const {id} = req.params
    const driver = await deleteDriverService(id)
    if (driver.length) {
        return sendResponse(res, 200, driver, "Driver deleted successfully");
    }
    throw new ApiError(404, "Driver not found");
})

const viewCurrentTripdetails = asyncHandler(async (req, res) => {
    const {id} = req.params
    const trip = await getDriverCurrentTrip(id)
    console.log(trip)
        if (trip.length) {
        return sendResponse(res, 200, trip, "Current trip found");
    }
    return sendResponse(res, 200, [], "No active trip");
})

const getDriverTripHistory = asyncHandler(async (req, res) => {
    const {id} = req.params
    const trips = await getDriverTripHistoryService(id)
    if (trips.length) {
        return sendResponse(res, 200, trips, "Trip history found");
    }
    return sendResponse(res, 200, [], "No trip history")
})

const getAllDriverList = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const user_id = req.user.id
    console.log(user_id)
    const drivers = await getDriversListService(Number(page), Number(limit), user_id);
    return sendResponse(res, 200, drivers, "Drivers fetched successfully");
});

const getAllDriverListBySearch = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10  } = req.query;
  const {search = "" } = req.query

  const user_id = req.user.id
    console.log(user_id)

  const drivers = await getDriversListeBySearchService(
    Number(page),
    Number(limit),
    search,
    user_id
  );

  return sendResponse(res, 200, drivers, "Drivers fetched successfully");
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