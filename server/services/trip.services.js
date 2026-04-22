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
    `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${coordsString}?geometries=geojson&access_token=${process.env.VITE_MAPBOX_TOKEN}`
    );
    // console.log(response)

    return response.data
}

function getEndTime(dateString, seconds) {
    // convert to ISO-safe format
    const date = new Date(dateString.replace(" ", "T"));

    // add seconds
    const newDate = new Date(date.getTime() + seconds * 1000);

    // format back to "YYYY-MM-DD HH:mm:ss"
    const pad = (n) => String(n).padStart(2, "0");

    return `${newDate.getFullYear()}-${
        pad(newDate.getMonth() + 1)
    }-${pad(newDate.getDate())} ${
        pad(newDate.getHours())
    }:${pad(newDate.getMinutes())}:${pad(newDate.getSeconds())}`;
}

const addTripService = async(data, dc_manager)=>{
    const {truck, 
        // gps_device, 
        driver, delivery_stops, departure} = data
    // if (truck.status  === "on_trip") throw new ApiError(400, "Truck is already on a trip")
    // if (driver.status === "on_trip") throw new ApiError(400, "Driver is already on a trip")
    // if (gps_device.status === "in_transit") throw new ApiError(400, "GPS device is already in use")
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
    console.log("1 : ",gps_points)
    gps_points.unshift([source_dc.longitude, source_dc.latitude])
    console.log("2 : ",gps_points)
    const geodata = await calculateGeodistance(gps_points)
    const total_distance = geodata.routes[0].distance / 1000
    const geopath = geodata.routes[0].geometry.coordinates
    
    const duration = geodata.routes[0].duration
    const speed = Math.abs((total_distance)/(duration/ 3600))+10
    const endtime = getEndTime(departure, duration)
    const [trip] = await sql`
        INSERT INTO "Trips" (
            "source_dc_id", "truck_id", "driver_id",
            "tracking_code", "status", "created_by", "scheduled_at", "distance", "geopath", "departed_at", "end_time", "speed_threshold"
        ) VALUES (
            ${source_dc.id}, ${truck}, ${driver},
            ${tracking_code}, 'scheduled', ${dc_manager},
            ${departure ?? null},
            ${total_distance},
            ${JSON.stringify(geopath)},
            ${departure},
            ${endtime},
            ${speed}
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

const allTripsService = async({ page, limit, status, city, search, user_id, role })=>{
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

            dc.name            AS source_dc_name,
            dc.city            AS dc_city,

            tr.registration_no,
            tr.model,
            tr.capacity,
            tr.id AS truck_id,

            CONCAT(u.first_name, ' ', u.last_name) AS driver_name,
            u.phone_number,
            d.id AS driver_id,

            COUNT(ts.id)                                        AS total_stops,
            COUNT(ts.id) FILTER (WHERE ts.status = 'confirmed') AS completed_stops,

            COALESCE(
                json_agg(
                    json_build_object(
                        'stop_id', ts.id,
                        'store_id', s.id,
                        'store_name', s.name,
                        'store_address',s.address, 
                        'latitude', s.latitude,
                        'longitude', s.longitude,
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
            ${city ? sql`AND t.status = ${city}`     : sql``}
            ${search ? sql`AND (
                t.tracking_code ILIKE ${'%' + search + '%'}
                OR tr.registration_no ILIKE ${'%' + search + '%'}
                OR u.first_name ILIKE ${'%' + search + '%'} 
                OR u.last_name ILIKE ${'%' + search + '%'} 
            )`: sql``}

        GROUP BY
            t.id,
            dc.name, dc.city,
            tr.registration_no, tr.model, tr.capacity, tr.id,
            d.id,
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

const trackTripService = async (data) => {
    const {tracking_code} = data
    const trip = await sql `
        SELECT
            t.id,
            t.tracking_code,
            t.status,
            t.scheduled_at,
            t.departed_at,
            t.completed_at,
            t.end_time,
            t.distance,
            t.created_at,

            dc.name AS dc_name,
            dc.city AS dc_city,

            tr.registration_no AS truck_reg,
            tr.model AS truck_model,
            tr.type AS truck_type,
            tr.status AS truck_status,
            

            CONCAT(u.first_name, ' ', u.last_name) AS driver_name,
            u.phone_number AS driver_phone,
            d.total_trips AS drivers_total_trip,

            COUNT(ts.id) AS total_stops,
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
            ) AS stops
        FROM "Trips" t
        JOIN "Distribution_center" dc ON dc.id = t.source_dc_id
        JOIN "Trucks" tr ON tr.id = t.truck_id
        JOIN "Drivers" d ON d.id = t.driver_id
        JOIN "User" u ON u.id = d.user_id

        LEFT JOIN "Trip_stops" ts ON ts.trip_id = t.id
        LEFT JOIN "Stores" s ON s.id = ts.store_id

        WHERE t.tracking_code = 'TRP-0047'

        GROUP BY
            t.id,
            dc.id,
            tr.id,
            d.id,
            u.id;
    `

    return trip
}


const getTrucksService = async ({ page = 1, limit = 10, search = "", departed_at }) => {

    console.log("departed_at", departed_at);
    
  const offset = (page - 1) * limit;

  const trucks = await sql`
    SELECT 
      t.id,
      t.registration_no,
      t.model,
      t.capacity,
      COUNT(*) OVER() AS total_count
    FROM "Trucks" t
    WHERE 
      (
        t.registration_no ILIKE ${"%" + search + "%"}
        OR t.model ILIKE ${"%" + search + "%"}
      )
      AND NOT EXISTS (
        SELECT 1 FROM "Trips" tr
        WHERE tr.truck_id = t.id
        AND tr.departed_at <= ${departed_at}
        AND tr.end_time >= ${departed_at}
      )
    ORDER BY t.registration_no ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return {
    trucks,
    total: trucks[0]?.total_count || 0,
    page,
    limit,
  };
};

const getDriversService = async ({ page = 1, limit = 10, search = "", departed_at }) => {
  const offset = (page - 1) * limit;

  const drivers = await sql`
    SELECT 
      d.id,
      CONCAT(u.first_name, ' ', u.last_name) AS driver_name,
      u.phone_number,
      d.licence_no,
      d.licence_class,
      COUNT(*) OVER() AS total_count
    FROM "Drivers" d
    JOIN "User" u ON u.id = d.user_id
    WHERE 
      (
        u.first_name ILIKE ${"%" + search + "%"}
        OR u.last_name ILIKE ${"%" + search + "%"}
        OR u.phone_number ILIKE ${"%" + search + "%"}
      )
      AND NOT EXISTS (
        SELECT 1 FROM "Trips" tr
        WHERE tr.driver_id = d.id
        AND tr.departed_at <= ${departed_at}
        AND tr.end_time >= ${departed_at}
      )
    ORDER BY u.first_name ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return {
    drivers,
    total: drivers[0]?.total_count || 0,
    page,
    limit,
  };
};

const getGpsDevicesService = async ({ page = 1, limit = 10, search = "", departed_at }, user) => {
  const offset = (page - 1) * limit;

  const gpsDevices = await sql`
    SELECT 
      g.id,
      g.device_id,
      g.imei,
      g.battery,
      g.status,
      COUNT(*) OVER() AS total_count
    FROM "GPS_devices" g
    WHERE 
      (
        g.device_id ILIKE ${"%" + search + "%"}
        OR g.imei ILIKE ${"%" + search + "%"}
      )
      ${
        user.role === "dc_manager"
          ? sql`AND g.dc_id = ${user.id}`
          : sql``
      }
      AND NOT EXISTS (
        SELECT 1 FROM "Trips" tr
        WHERE tr.device_id = g.id
        AND tr.departed_at <= ${departed_at}
        AND tr.end_time >= ${departed_at}
      )
    ORDER BY g.device_id ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return {
    gpsDevices,
    total: gpsDevices[0]?.total_count || 0,
    page,
    limit,
  };
};


const getStoresService = async ({ page = 1, limit = 10, search = "" }) => {
  const offset = (page - 1) * limit;

  const stores = await sql`
    SELECT 
      s.id,
      s.name,
      s.address,
      s.city,
      s.state,
      s.latitude,
      s.longitude,
      COUNT(*) OVER() AS total_count
    FROM "Stores" s
    WHERE 
      s.status = 'active'
      AND (
        s.name ILIKE ${"%" + search + "%"}
        OR s.city ILIKE ${"%" + search + "%"}
      )
    ORDER BY s.name ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return {
    stores,
    total: stores[0]?.total_count || 0,
    page,
    limit,
  };
};

export{
    addTripService,
    allTripsService,
    cancelTripService,
    trackTripService,
    getTrucksService,
    getDriversService,
    getGpsDevicesService,
    getStoresService
}