import sql from "../db/database.js"
import * as turf from '@turf/turf';
import axios from "axios";


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
    // const line = turf.lineString(gps_points);

    // const totalDistance = turf.length(line, {
    //     units: 'kilometers'
    // });

    const coordsString = gps_points
    .map(c => c.join(","))
    .join(";");

    const response = await axios.get(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=geojson&access_token=${process.env.VITE_MAPBOX_TOKEN}`
    );
    // console.log(response.data.routes)

    return response.data
}

const addTripService = async(data, dc_manager)=>{
    const {truck, gps_device, driver, delivery_stops, departure} = data
    if (truck.status  === "on_trip") throw new ApiError(400, "Truck is already on a trip")
    if (driver.status === "on_trip") throw new ApiError(400, "Driver is already on a trip")
    if (gps_device.status === "in_transit") throw new ApiError(400, "GPS device is already in use")
    console.log(dc_manager)
    const tracking_code = await generateTrackingCode()
    const [source_dc] = await sql`
        SELECT "id", "longitude", "latitude" FROM "Distribution_center"
        WHERE dc_manager = ${dc_manager}
    `
    // const gps_points = []
    // for (let i = 0; i < delivery_stops.length; i++){
    //     const {longitude, latitude} = delivery_stops[i]
    //     gps_points.append([longitude, latitude])
    // }
    console.log(source_dc)
    let gps_points = delivery_stops.map(({ longitude, latitude }) => [longitude, latitude])
    gps_points.unshift([source_dc.longitude, source_dc.latitude])
    
    const geodata = await calculateGeodistance(gps_points)
    const total_distance = geodata.routes[0].distance / 1000
    const geopath = geodata.routes[0].geometry.coordinates
    
    
    const [trip] = await sql`
        INSERT INTO "Trips" (
            "source_dc_id", "truck_id", "driver_id", "device_id",
            "tracking_code", "status", "created_by", "scheduled_at", "distance", "geopath"
        ) VALUES (
            ${source_dc.id}, ${truck}, ${driver}, ${gps_device},
            ${tracking_code}, 'scheduled', ${dc_manager},
            ${departure ?? null},
            ${total_distance},
            ${geopath}
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

    return trip

}

const allTripsService = async({ page, limit, status, search, user_id, role })=>{
    const offset = (page - 1) * limit

    // DC manager: only see their own DC's trips
    let dcId = null
    if (role === "dc_manager") {
        const [dc] = await sql`
            SELECT id FROM "Distribution_center" WHERE dc_manager = ${user_id}
        `
        dcId = dc?.id || null
    }
    const trips = await sql`
        SELECT
            t.id,
            t.tracking_code,
            t.status,
            t.scheduled_at,
            t.departed_at,
            t.completed_at,
            t.distance,
            t.created_at,

            dc.name            AS dc_name,
            dc.city            AS dc_city,

            tr.registration_no AS truck_reg,
            tr.model           AS truck_model,

            CONCAT(u.first_name, ' ', u.last_name) AS driver_name,
            u.phone_number     AS driver_phone,

            COUNT(ts.id)                                        AS total_stops,
            COUNT(ts.id) FILTER (WHERE ts.status = 'confirmed') AS completed_stops,

            COALESCE(
                json_agg(
                    json_build_object(
                        'stop_id', ts.id,
                        'store_id', s.id,
                        'store_name', s.name,
                        'eta', ts.eta,
                        'arrived_at', ts.arrived_at,
                        'status', ts.status
                    )
                ) FILTER (WHERE ts.id IS NOT NULL),
                '[]'
            ) AS stops,

            COUNT(*) OVER() AS total_count

        FROM "Trips" t
        JOIN "Distribution_center" dc ON dc.id = t.source_dc_id
        JOIN "Trucks" tr ON tr.id = t.truck_id
        JOIN "Drivers" d ON d.id = t.driver_id
        JOIN "User" u ON u.id = d.user_id

        LEFT JOIN "Trip_stops" ts ON ts.trip_id = t.id
        LEFT JOIN "Stores" s ON s.id = ts.store_id

        WHERE 1=1
            ${dcId   ? sql`AND t.source_dc_id = ${dcId}` : sql``}
            ${status ? sql`AND t.status = ${status}`     : sql``}
            ${search ? sql`AND t.tracking_code ILIKE ${'%' + search + '%'}` : sql``}

        GROUP BY
            t.id,
            dc.name, dc.city,
            tr.registration_no, tr.model,
            u.first_name, u.last_name, u.phone_number

        ORDER BY t.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
    `

    const total = trips.length ? Number(trips[0].total_count) : 0
    return {data: trips,
        pagination: {       // FIX 2: was missing opening brace here
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },}
}

const cancelTripService = async (id) => {

    const trip = await sql `
        UPDATE "Trips"
        SET "status" = 'cancelled'
        WHERE "id" = ${id}
        RETURNING *   
    `

    return trip
    
}


export{
    addTripService,
    allTripsService,
    cancelTripService
}