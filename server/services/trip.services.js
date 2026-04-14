import sql from "../db/database.js"

async function generateTrackingCode() {
    const [row] = await sql`
        SELECT 'TRP-' || LPAD(
            (COALESCE(MAX(CAST(SPLIT_PART(tracking_code, '-', 2) AS INT)), 2800) + 1)::TEXT,
            4, '0'
        ) AS code
        FROM "Trips"
        WHERE tracking_code ~ '^TRP-[0-9]+$'
    `
    return row.code
}

const calculateGeodistance = async(gps_points)=>{
    const line = turf.lineString(gps_points);

    const totalDistance = turf.length(line, {
        units: 'kilometers'
    });

    return totalDistance
}

const addTripService = async(data, dc_manager)=>{
    const {truck, gps_device, driver, delivery_stops, departure} = data
    if (truck.status  === "on_trip") throw new ApiError(400, "Truck is already on a trip")
    if (driver.status === "on_trip") throw new ApiError(400, "Driver is already on a trip")
    if (gps_device.status === "in_transit") throw new ApiError(400, "GPS device is already in use")
    
    const tracking_code = await generateTrackingCode()
    const [source_dc] = await sql`
        SELECT "id", "logitude", "latitude" FROM "Distribution_center"
        WHERE dc_manager = ${dc_manager}
    `
    // const gps_points = []
    // for (let i = 0; i < delivery_stops.length; i++){
    //     const {longitude, latitude} = delivery_stops[i]
    //     gps_points.append([longitude, latitude])
    // }

    const gps_points = delivery_stops.map(({ longitude, latitude }) => [longitude, latitude])
    const total_distance = calculateGeodistance(gps_points)

    const [trip] = await sql`
        INSERT INTO "Trips" (
            "source_dc_id", "truck_id", "driver_id", "device_id",
            "tracking_code", "status", "created_by", "scheduled_at", "distance"
        ) VALUES (
            ${source_dc.id}, ${truck}, ${driver}, ${gps_device},
            ${tracking_code}, 'scheduled', ${dc_manager},
            ${departure ?? null},
            ${total_distance}
        )
        RETURNING *
    `

    if (delivery_stops?.length) {
        for (let i = 0; i < delivery_stops.length; i++) {
            const { store_id, eta,  } = delivery_stops[i]
            await sql`
                INSERT INTO "Trip_stops" (trip_id, store_id, eta, status)
                VALUES (${trip.id}, ${store_id}, ${eta ?? null}, 'pending')
            `
        }
    }

}


export{
    addTripService
}