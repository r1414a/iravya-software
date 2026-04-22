import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sendResponse from "../utils/sendResponse.js";

import { getDriverTripsService,
    getCurrentTripService,
    confirmStopDeliveryService
 } from "../services/driverAPP.service.js";


const getDriverTrips = asyncHandler(async (req, res) => {
    const {id} = req.params
    const trip_data = await getDriverTripsService(id)
    if(trip_data){sendResponse(res, 201, trip_data, "Found trip data")}
    else{
        sendResponse(res, 200, trip_data, "No data found")
    }
})

const getCurrentTrip =  asyncHandler(async (req, res) => {
    const {id} = req.params
    console.log(id)
    const trip = await getCurrentTripService(id)
    // console.log(trip)
    if(trip.length){
        sendResponse(res, 201, trip, "Current Trip")
    }
    else{
        sendResponse(res, 200, trip, "No current trip")
    }

})

const confirmStopDelivery = asyncHandler(async (req, res) => {
   const {stop_id, trip_id} = req.params
   const stop_delivery = await confirmStopDeliveryService(stop_id, trip_id)
   if(stop_delivery.length){
        sendResponse(res, 200, stop_delivery, "Confirm delivery")
   }
   else{
        throw new ApiError(200, 'Not found trip')
   }
})



export{
    getDriverTrips,
    getCurrentTrip,
    confirmStopDelivery,

}