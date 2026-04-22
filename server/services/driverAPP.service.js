import sql from "../db/database.js"
import * as turf from '@turf/turf';
import axios from "axios";


const getDriverTripsService= async (id) => {
    const trips = await sql`
        SELECT 
            trip_type,
            json_agg(trip_data) as trips
        FROM (
            SELECT 
                tr.id,
                tr.driver_id,
                tr.truck_id,
                tr.device_id,
                tr.departed_at,
                tr.end_time,
                tr.status,

                json_agg(
                    json_build_object(
                        'stop_id', ts.id,
                        'store_id', ts.store_id,
                        'eta', ts.eta,
                        'arrived_at', ts.arrived_at,
                        'confirmed_at', ts.confirmed_at,
                        'status', ts.status,
                        'store', json_build_object(
                            'id', s.id,
                            'name', s.name,
                            'address', s.address,
                            'city', s.city,
                            'state', s.state,
                            'country', s.country,
                            'latitude', s.latitude,
                            'longitude', s.longitude,
                            'store_code', s.store_code
                        )
                    )
                ) FILTER (WHERE ts.id IS NOT NULL) as stops,

                CASE 
                    WHEN tr.departed_at < CURRENT_DATE 
                    THEN 'past'
                    ELSE 'upcoming'
                END as trip_type

            FROM "Trips" tr

            LEFT JOIN "Trip_stops" ts 
            ON ts.trip_id = tr.id

            LEFT JOIN "Stores" s 
            ON s.id = ts.store_id

            WHERE tr.driver_id = ${id}

            GROUP BY tr.id

        ) trip_data

        GROUP BY trip_type;
    `
    return trips
}

const getCurrentTripService = async (id) => {
    
}

export{
    getDriverTripsService,
    getCurrentTripService
}