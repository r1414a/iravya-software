import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import sendResponse from "../utils/sendResponse.js";
import sql from "../db/database.js"
import { addTripService,
    allTripsService,
    cancelTripService
 } from "../services/trip.services.js";

const getData = asyncHandler(async (req, res) => {
    let gps_devices = null

    if (req.user.role === "dc_manager") {
        gps_devices = await sql`
            SELECT * FROM "GPS_devices"
            WHERE "dc_id" = ${req.user.id}
        `
    } else {
        gps_devices = await sql`
            SELECT * FROM "GPS_devices"
        `
    }

    const trucks = await sql`
        SELECT * FROM "Trucks"
    `

    const drivers = await sql`
        SELECT * FROM "Drivers"
    `
    const stores = await sql `
        SELECT * FROM "Stores"    
    `

    sendResponse(res, 200, { gps_devices, trucks, drivers, stores }, "Fetched Data")
})


const addTrip = asyncHandler(async(req, res)=>{
    const trip = await addTripService(req.body,req.user.id)
    sendResponse(res, 200, trip, "Trip data added successfully")
})

const allTrips = asyncHandler(async (req, res) => {
    let { page, limit, status, search } = req.query
    page   = parseInt(page)  || 1
    limit  = parseInt(limit) || 10
    search = search?.trim()  || null
    status = status          || null
    const trips = await allTripsService({page, limit, status, search,
        user_id: req.user.id,
        role:    req.user.role,})
    sendResponse(res, 201, trips, "Trips data")
    
})

const cancelTrip = asyncHandler(async (req, res) => {
    const {id} = req.params
    const trip = await cancelTripService(id)
    if(trip.length){
        sendResponse(res, 200, trip, "Trip is cancelled")
    }
    else{
        ApiError(200, "Trip data not found")
    }
})

export{
    getData,
    addTrip,
    allTrips,
    cancelTrip
}