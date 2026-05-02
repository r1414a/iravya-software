import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import sendResponse from "../utils/sendResponse.js";
import sql from "../db/database.js"
import { addTripService,
    allTripsService,
    cancelTripService,
    trackTripService,
    getTrucksService,
    getDriversService,
    getGpsDevicesService,
    getStoresService,
    reportIssueService,
    updateTripService
 } from "../services/trip.services.js";

const getData = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = "" } = req.query;
    let gps_devices = null
    const offset = (page - 1) * limit;
    const {departed_at} = req.body
    if (req.user.role === "dc_manager") {
        gps_devices = await sql`
            SELECT 
                g.id,
                g.device_id,
                g.imei,
                g.battery,
                g.status
            FROM "GPS_devices" g

            WHERE g.dc_id = ${req.user.id}
            
            AND NOT EXISTS (
                SELECT 1 
                FROM "Trips" tr
                WHERE tr.device_id = g.id
                AND tr.departed_at <= ${departed_at}
                AND tr.end_time >= ${departed_at}
            );
            LIMIT ${limit}
            OFFSET ${offset}
        `
    } else {
        gps_devices = await sql`
            SELECT * FROM "GPS_devices"
            LIMIT ${limit}
            OFFSET ${offset}
        `
    }

    const trucks = await sql`
        SELECT 
            t.id,
            t.registration_no,
            t.model,
            t.capacity
        FROM "Trucks" t
        WHERE NOT EXISTS (
            SELECT 1 
            FROM "Trips" tr
            WHERE tr.truck_id = t.id
            AND tr.departed_at <= ${departed_at}
            AND tr.end_time >= ${departed_at}
        );
        LIMIT ${limit}
        OFFSET ${offset}
    `

    const drivers = await sql`
        SELECT 
            d.id,
            CONCAT(u.first_name, ' ', u.last_name)  AS driver_name,
            u.phone_number AS driver_phone,
            d.licence_no,
            d.licence_class
        FROM "Drivers" d
        JOIN "User" u ON u.id = d.user_id
        WHERE NOT EXISTS (
            SELECT 1 
            FROM "Trips" tr
            WHERE tr.driver_id = d.id
            AND tr.departed_at <= ${departed_at}
            AND tr.end_time >= ${departed_at}
        );
        LIMIT ${limit}
        OFFSET ${offset}
    `
    const stores = await sql `
        SELECT * FROM "Stores"  
        WHERE "status" = 'active'
        LIMIT ${limit}
        OFFSET ${offset}  
    `

    sendResponse(res, 200, { gps_devices, trucks, drivers, stores }, "Fetched Data")
})



const getTrucksController = asyncHandler(async (req, res) => {
  const result = await getTrucksService(req.query);
  sendResponse(res, 200, result, "Trucks fetched");
});


const getDriversController = asyncHandler(async (req, res) => {
  const result = await getDriversService(req.query);
  sendResponse(res, 200, result, "Drivers fetched");
});


const getGpsDevicesController = asyncHandler(async (req, res) => {
  const result = await getGpsDevicesService(req.query, req.user);
  sendResponse(res, 200, result, "GpsDevices fetched");
});

const getStoresController = asyncHandler(async (req, res) => {
  const result = await getStoresService(req.query);
  sendResponse(res, 200, result, "Store fetched");
});


const addTrip = asyncHandler(async(req, res)=>{
    const trip = await addTripService(req.body,req.user.id)
    // console.log(trip)
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

const updateTrip = asyncHandler(async (req, res) => {
    const {id} = req.params
    const trip = await updateTripService(id, req.body, req.user.id)
    if(trip){
        sendResponse(res, 200, trip, "Trip data updated successfully")
    }
    else{
        throw new ApiError(400, "Bad request")
    }
})

const trackTrip = asyncHandler(async(req, res)=>{
    
    const trip = await trackTripService(req.body)
    sendResponse(res, 201, trip, "Trip data found")

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
    getData,
    addTrip,
    allTrips,
    cancelTrip,
    trackTrip,
    getTrucksController,
    getDriversController,
    getGpsDevicesController,
    getStoresController,
    reportIssue,
    updateTrip
}