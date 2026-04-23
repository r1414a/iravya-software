import sql from "../db/database.js"
import * as turf from '@turf/turf';
import axios from "axios";
import { sendEmail } from "../utils/mailer.js"


const getDriverTripsService= async (id) => {
    const trips = await sql`
        SELECT 
            trip_type,
            json_agg(trip_data) as trips
        FROM (
            SELECT 
                tr.id,

                tr.driver_id,
                CONCAT(u.first_name, ' ', u.last_name) AS driver_name,
                u.phone_number AS driver_phone,
                u.email AS driver_email,

                tr.truck_id,
                t.registration_no AS truck_no,
                t.type AS truck_type,
                t.capacity AS truck_capacity,
                
                tr.device_id,
                tr.departed_at,
                tr.end_time,
                tr.status,

                -- Distribution Center
                json_build_object(
                    'id', dc.id,
                    'name', dc.name,
                    'address', dc.address,
                    'city', dc.city,
                    'state', dc.state,
                    'country', dc.country,
                    'latitude', dc.latitude,
                    'longitude', dc.longitude,

                    -- DC Manager
                    'dc_manager', json_build_object(
                        'id', dcm.id,
                        'first_name', dcm.first_name,
                        'last_name', dcm.last_name,
                        'phone_number', dcm.phone_number,
                        'email', dcm.email
                    )

                ) as dc,

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
                            'store_code', s.store_code,

                            -- Store Manager
                            'store_manager', json_build_object(
                                'id', sm.id,
                                'first_name', sm.first_name,
                                'last_name', sm.last_name,
                                'phone_number', sm.phone_number,
                                'email', sm.email
                            )
                        )
                    )
                    ORDER BY ts.eta
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

            -- Distribution Center
            LEFT JOIN "Distribution_center" dc 
                ON dc.id = tr.source_dc_id

            -- DC Manager
            LEFT JOIN "User" dcm 
                ON dcm.id = dc.dc_manager

            -- Store Manager
            LEFT JOIN "User" sm 
                ON sm.id = s.store_manager

            LEFT JOIN "Drivers" d
                ON d.id = tr.driver_id

            LEFT JOIN "User" u
                ON u.id = d.user_id

            LEFT JOIN "Trucks" t
                ON t.id = tr.truck_id

            WHERE tr.driver_id = ${id}
                AND tr.status != 'cancelled'
            

            GROUP BY 
                tr.id,
                dc.id,
                dcm.id,
                u.id,
                t.id,
                d.id

        ) trip_data

        GROUP BY trip_type;
    `
    return trips
}

const getCurrentTripService = async (id) => {
    const trip_data = await sql`
        SELECT 
            tr.id,
            tr.driver_id,
            tr.device_id,
            tr.departed_at,
            tr.end_time,
            tr.status,

            json_build_object(
                'id', t.id,
                'registration_no', t.registration_no,
                'model', t.model,
                'type', t.type,
                'capacity', t.capacity,
                'total_trips', t.total_trips
            ) as "truck",

            -- Distribution Center
            json_build_object(
                'id', dc.id,
                'name', dc.name,
                'address', dc.address,
                'city', dc.city,
                'state', dc.state,
                'country', dc.country,
                'latitude', dc.latitude,
                'longitude', dc.longitude,

                'dc_manager', json_build_object(
                    'id', dcm.id,
                    'first_name', dcm.first_name,
                    'last_name', dcm.last_name,
                    'phone_number', dcm.phone_number,
                    'email', dcm.email
                )
            ) as dc,

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
                        'store_code', s.store_code,

                        'store_manager', json_build_object(
                            'id', sm.id,
                            'first_name', sm.first_name,
                            'last_name', sm.last_name,
                            'phone_number', sm.phone_number,
                            'email', sm.email
                        )
                    )
                )
                ORDER BY ts.eta
            ) FILTER (WHERE ts.id IS NOT NULL) as stops

        FROM "Trips" tr
        LEFT JOIN "Trip_stops" ts ON ts.trip_id = tr.id
        LEFT JOIN "Stores" s ON s.id = ts.store_id
        LEFT JOIN "Distribution_center" dc ON dc.id = tr.source_dc_id
        LEFT JOIN "User" dcm ON dcm.id = dc.dc_manager
        LEFT JOIN "User" sm ON sm.id = s.store_manager
        LEFT JOIN "Trucks" t ON t.id = tr.truck_id

        WHERE 
            tr.driver_id = ${id}
            AND tr.is_acceptedby_driver = true
            AND tr.status = 'in_transit'

        GROUP BY 
            tr.id,
            dc.id,
            dcm.id,
            t.id  -- Added truck ID to GROUP BY to avoid errors

        ORDER BY tr.departed_at DESC
        LIMIT 1;
    `
    // console.log(trip_data)
    return trip_data
}

const confirmStopDeliveryService = async(stop_id, trip_id) =>{
    await sql`
        UPDATE "Trip_stops"
        SET
            status = 'confirmed',
            confirmed_at = NOW()
        WHERE
            trip_id = ${trip_id}
            AND id = ${stop_id}
    `
    
    
    
        const toemails = await sql`
            SELECT
                dcm.email AS dc_manager_email,
                scm.email AS store_manager_email,
                s.name AS store_name,

                -- DC Details
                dc.id AS dc_id,
                dc.name AS dc_name,
                dc.address AS dc_address,
                dc.city AS dc_city,
                dc.state AS dc_state,

                -- Truck Details
                t.id AS truck_id,
                t.registration_no AS truck_no,
                t.type AS truck_type,
                t.capacity AS truck_capacity,

                -- Driver Details
                d.id AS driver_id,
                CONCAT(u.first_name, ' ', u.last_name) AS driver_name,
                u.phone_number AS driver_phone,
                u.email AS driver_email

            FROM "Trips" tr

            LEFT JOIN "Trip_stops" ts
                ON ts.trip_id = tr.id

            LEFT JOIN "Stores" s
                ON s.id = ts.store_id

            LEFT JOIN "Distribution_center" dc
                ON dc.id = tr.source_dc_id

            LEFT JOIN "Drivers" d
                ON d.id = tr.driver_id

            LEFT JOIN "User" u
                ON u.id = d.user_id

            LEFT JOIN "User" dcm
                ON dcm.id = dc.dc_manager

            LEFT JOIN "User" scm
                ON scm.id = s.store_manager

            -- Missing LEFT JOIN for Trucks
            LEFT JOIN "Trucks" t
                ON t.id = tr.truck_id

            WHERE tr.id = ${trip_id}
            AND ts.id = ${stop_id};


        `
        const emails = [
            toemails[0]?.dc_manager_email,
            toemails[0]?.store_manager_email
        ].filter(Boolean)

        console.log("Emails:", emails)
        // console.log(toemails)
        await sendEmail({
            to: emails,
            subject: `Welcome to Iravya | Store Delivery Confirmation of ${toemails[0]?.store_name} `,
            html: `
                <p>Hope your are doing well</p>
                <p>We are notifying you that the delivery has been successfully completed at ${toemails[0]?.store_name} 
                Below are the details of delivery</p>
                <p>Delivery Details</p>
                <p>DC Name: ${toemails[0]?.dc_name} </p>
                <p>Stop(store name): ${toemails[0]?.store_name}</p>
                <p>Truck Number: ${toemails[0]?.truck_no} (${toemails[0]?.truck_type})</p>
                <p>Driver : ${toemails[0]?.driver_name}(${toemails[0]?.driver_phone})</p>

                <div >
                    Best resgrads,
                </div>
            `
        })
    
    return toemails
}

const acceptTripService =  async (trip_id) => {
    const trip = await sql`
            UPDATE "Trips"
            SET status = 'in_transit',
                is_acceptedby_driver = true
            WHERE id = ${trip_id}
            RETURNING *;
        `;

        await sql`
            UPDATE "Trucks" t
            SET status = 'in_transit'
            FROM "Trips" tr
            WHERE tr.truck_id = t.id
            AND tr.id = ${trip_id};
        `;

        await sql`
            UPDATE "Drivers" d
            SET status = 'on_trip'
            FROM "Trips" tr
            WHERE tr.driver_id = d.id
            AND tr.id = ${trip_id};
        `;

    return trip
}

const reportIssueService = async (trip_id, issue_type, issue) => {
    const issue_data = await sql`
        INSERT INTO "Report Issue" (
            trip,
            issue_type,
            complaint,
            is_complaintby_driver
        )
        SELECT
            ${trip_id},
            unnest(${sql.array(issue_type)}::trip_issue[]),  -- ✅ FIX
            ${issue},
            true
        RETURNING *;
    `;
    return issue_data;
};

export{
    getDriverTripsService,
    getCurrentTripService,
    confirmStopDeliveryService,
    acceptTripService,
    reportIssueService
}