import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import sendResponse from "../utils/sendResponse.js";
import sql from "../db/database.js"

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

    sendResponse(res, 200, { gps_devices, trucks, drivers }, "Fetched Data")
})


const addTrip = asyncHandler(async(req, res)=>{
    const trip = await addTripService(req.body)
    sendResponse(res, 200, trip, "Trip data added successfully")
})

export{
    getData,
    addTrip
}