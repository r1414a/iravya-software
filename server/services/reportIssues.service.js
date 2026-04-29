import sql from "../db/database.js"
import * as turf from '@turf/turf';
import axios from "axios";

// const getAllReportIssuesService = async (filters) => {
//     const {page, limit,user, search, issue_type} = filters
//     const offset = (page - 1) * limit;
//     const {user_id , user_role} = user
//     const issues = user_role ==="super-admin"?(await sql`
//         SELECT 
//             r.*,

//             s.id AS store_id,
//             s.name AS store_name,
//             s.address AS store_address,
//             CONCAT(scm.first_name, ' ', scm.last_name) AS store_manager,
//             scm.phone_number AS store_manager_phone,
//             scm.email AS store_manager_email,

//             dc.id AS dc_id,
//             dc.name AS dc_name,
//             dc.address AS dc_address,
//             CONCAT(dcm.first_name, ' ', dcm.last_name) AS dc_manager_name,
//             dcm.phone_number AS dc_manager_phone,

//             t.departed_at,
//             t.end_time,
//             t.completed_at AS trip_completed_at,
//             t.distance,
//             t.tracking_code AS trip_tracking_code,

//             tr.registration_no AS truck_no,
//             tr.model AS truck_model,
//             tr.type AS truck_type,
//             tr.capacity

//         FROM "Report Issue" r

//         LEFT JOIN "Trips" t
//             ON t.id = r.trip

//         LEFT JOIN "Stores" s
//             ON s.id = r.store_id

//         LEFT JOIN "User" scm
//             ON scm.id = s.store_manager

//         LEFT JOIN "Trucks" tr
//             ON tr.id = t.truck_id

//         LEFT JOIN "Distribution_center" dc
//             ON dc.id = t.source_dc_id

//         LEFT JOIN "User" dcm
//             ON dcm.id = dc.dc_manager;
//         WHERE 1=1
//             ${issue_type ? sql`AND r.issue_type = ${issue_type}`     : sql``}
//             ${search ? sql`AND (
//                 t.tracking_code ILIKE ${'%' + search + '%'}
//                 OR tr.registration_no ILIKE ${'%' + search + '%'}
//             )`: sql``}


//         LIMIT ${limit}
//         OFFSET ${offset}
//     `):(
//         await sql `
//             SELECT 
//                 r.*,

//                 s.id AS store_id,
//                 s.name AS store_name,
//                 s.address AS store_address,
//                 CONCAT(scm.first_name, ' ', scm.last_name) AS store_manager,
//                 scm.phone_number AS store_manager_phone,
//                 scm.email AS store_manager_email,

//                 dc.id AS dc_id,
//                 dc.name AS dc_name,
//                 dc.address AS dc_address,
//                 CONCAT(dcm.first_name, ' ', dcm.last_name) AS dc_manager_name,
//                 dcm.phone_number AS dc_manager_phone,

//                 t.departed_at,
//                 t.end_time,
//                 t.completed_at AS trip_completed_at,
//                 t.distance,
//                 t.tracking_code AS trip_tracking_code,

//                 tr.registration_no AS truck_no,
//                 tr.model AS truck_model,
//                 tr.type AS truck_type,
//                 tr.capacity

//             FROM "Report Issue" r

//             LEFT JOIN "Trips" t
//                 ON t.id = r.trip

//             LEFT JOIN "Stores" s
//                 ON s.id = r.store_id

//             LEFT JOIN "User" scm
//                 ON scm.id = s.store_manager

//             LEFT JOIN "Trucks" tr
//                 ON tr.id = t.truck_id

//             LEFT JOIN "Distribution_center" dc
//                 ON dc.id = t.source_dc_id

//             LEFT JOIN "User" dcm
//                 ON dcm.id = dc.dc_manager;
            
//             WHERE 1=1
//                 ${user_id   ? sql`AND t.source_dc_id = ${user_id}` : sql``}
//                 ${issue_type ? sql`AND r.issue_type = ${issue_type}`     : sql``}
//                 ${search ? sql`AND (
//                     t.tracking_code ILIKE ${'%' + search + '%'}
//                     OR tr.registration_no ILIKE ${'%' + search + '%'}
//                 )`: sql``}

//             LIMIT ${limit}
//             OFFSET ${offset}  
        
//         ` 
//     )
//     return issues
// }

const getAllReportIssuesService = async (filters) => {
    const { page, limit, user, search, issue_type } = filters;

    const offset = (page - 1) * limit;
    const { user_id, user_role } = user;

    // 🔹 Start with base condition
    let where = sql`WHERE 1=1`;

    if (issue_type) {
        where = sql`${where} AND r.issue_type = ${issue_type}`;
    }

    if (search) {
        where = sql`${where} AND (
            t.tracking_code ILIKE ${'%' + search + '%'}
            OR tr.registration_no ILIKE ${'%' + search + '%'}
        )`;
    }

    if (user_role !== "super_admin" && user_id) {
        where = sql`${where} AND dc.dc_manager = ${user_id}`;
    }

    const issues = await sql`
        SELECT 
            r.*,
            COUNT(*) OVER() AS total_count,

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
            ON dcm.id = dc.dc_manager

        ${where}

        LIMIT ${limit}
        OFFSET ${offset}
    `;

    return {
        data :issues,
        total: Number(issues[0]?.total_count) || 0,
        page,
        limit,
        total_pages: Math.ceil((issues[0]?.total_count|| 0) / limit)
        
    };
};

export{
    getAllReportIssuesService
}