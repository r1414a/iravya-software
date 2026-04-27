import sql from "../db/database.js"
import * as turf from '@turf/turf';
import axios from "axios";

const getAllReportIssuesService = async () => {
    const issues = await sql`
        SELECT 
            r.*,

            s.id AS store_id,
            s.name AS store_name,
            s.address AS store_address,
            CONCAT(scm.first_name, ' ', scm.last_name) AS store_manager,
            scm.phone_number AS store_manager_phone,
            scm.email AS store_manager_email,

            dc.id AS dc_id,
            dc.name AS dc_name,
            dc.address AS dc_address,
            CONCAT(dcm.first_name, ' ', dcm.last_name) AS dc_manager_name,
            dcm.phone_number AS dc_manager_phone,

            t.departed_at,
            t.end_time,
            t.completed_at AS trip_completed_at,
            t.distance,
            t.tracking_code AS trip_tracking_code,

            tr.registration_no AS truck_no,
            tr.model AS truck_model,
            tr.type AS truck_type,
            tr.capacity

        FROM "Report Issue" r

        LEFT JOIN "Trips" t
            ON t.id = r.trip

        LEFT JOIN "Stores" s
            ON s.id = r.store_id

        LEFT JOIN "User" scm
            ON scm.id = s.store_manager

        LEFT JOIN "Trucks" tr
            ON tr.id = t.truck_id

        LEFT JOIN "Distribution_center" dc
            ON dc.id = t.source_dc_id

        LEFT JOIN "User" dcm
            ON dcm.id = dc.dc_manager;
    `
    return issues
}

export{
    getAllReportIssuesService
}