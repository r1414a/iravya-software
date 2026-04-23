import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sendResponse from "../utils/sendResponse.js";

import { getDriverTripsService,
    getCurrentTripService,
    confirmStopDeliveryService,
    acceptTripService,
    reportIssueService
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

const acceptTrip = asyncHandler(async (req, res) => {
    const {trip_id} = req.params

    const trip = await acceptTripService(trip_id)
    if(trip.length){
        sendResponse(res, 200, trip, "Accepted trip successfully")

    }
    else{
        throw new ApiError(404, "Trip not found")
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

const reportIssue = asyncHandler(async (req, res) => {
    const {trip_id} = req.params
    const {issue_type, issue} = req.body

    const issue_data = await reportIssueService(trip_id, issue_type, issue)
    if(issue.length){
        sendResponse(res, 200, issue_data, "Reported issue successfully")
    }
    else{
        throw new ApiError(400, "Bad Request")
    }
})



export{
    getDriverTrips,
    getCurrentTrip,
    confirmStopDelivery,
    acceptTrip,
    reportIssue

}