import sql from "../db/database.js"
import * as turf from '@turf/turf';
import axios from "axios";
import polyline from "@mapbox/polyline";


const AlertDataService = async (
    type,
    severity,
    is_read,
    page,
    limit,
    search,
    user_id,
    user_role
    ) => {
    const offset = (page - 1) * limit;

    const alerts = await sql`
        SELECT 
        COUNT(*) OVER() AS total_count,
        a.type AS alert_type,
        a.description,
        a.severity,
        a.is_read,
        a.triggered_at,

        t.tracking_code,
        t.speed_threshold,

        tr.registration_no AS truck_no,
        dc.name AS dc_name,
        

        CONCAT(u.first_name, ' ', u.last_name) AS driver_name,
        u.phone_number AS driver_phone,
        d.id AS driver_id

        FROM "Alerts" a

        LEFT JOIN "Trips" t
        ON t.id = a.trip_id

        LEFT JOIN "Trucks" tr
        ON tr.id = a.truck_id

        LEFT JOIN "Distribution_center" dc
        ON dc.id = a.dc_id

        LEFT JOIN "Drivers" d
        ON d.id = t.driver_id

        LEFT JOIN "User" u
        ON u.id = d.user_id

        WHERE 1=1


        ${user_role !== "super_admin"
        ? sql`AND dc.dc_manager = ${user_id}`
        : sql``}

        
        ${(search !== null && search !== undefined && search !== '')
        ? sql`
            AND (
            u.first_name ILIKE ${'%' + search + '%'}
            OR u.last_name ILIKE ${'%' + search + '%'}
            OR t.tracking_code ILIKE ${'%' + search + '%'}
            OR tr.registration_no ILIKE ${'%' + search + '%'}
            )
        `
        : sql``}

        
        ${(type !== null && type !== undefined && type !== '')
        ? sql`AND a.type = ${type}`
        : sql``}

      
        ${(severity !== null && severity !== undefined && severity !== '')
        ? sql`AND a.severity = ${severity}`
        : sql``}

       
        ${(is_read !== null && is_read !== undefined)
        ? sql`AND a.is_read = ${is_read}`
        : sql``}

        GROUP BY
            a.id,
            d.id,
            dc.id,
            t.id,
            tr.id,
            u.id

        ORDER BY a.triggered_at DESC
        LIMIT ${limit}
        OFFSET ${offset};
    `;


    const total = alerts.length ? Number(alerts[0].total_count) : 0
    return {data: alerts,
        pagination: {       // FIX 2: was missing opening brace here
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },}
};

const MarkAsReadService = async (id) => {
    const [alert] = await sql `
        UPDATE "Alerts"
            SET "is_read" = true
        WHERE id = ${id}
        RETURNING *
    `
    return {alert}
}

const MarkAllAsReadService = async (id,role) => {
    let dcId = null;
    if (role !== "super_admin") {
        const dc = await sql`
        SELECT id FROM "Distribution_center"
        WHERE dc_manager = ${user_id}
        LIMIT 1
        `;

        if (!dc.length) return [];
        dcId = dc[0].id;
    }

    
    const alerts = await sql`
        UPDATE "Alerts"
        SET is_read = true
        WHERE is_read = false
        ${
        role !== "super_admin"
            ? sql`AND dc_id = ${dcId}`
            : sql``
        }
        
        RETURNING id, type, description, triggered_at
    `;

    return alerts
}

const deleteAlertService = async (id) => {
    const alert = await sql`
        DELETE FROM "Alerts"
        WHERE id = ${id}
        RETURNING id, type, description, triggered_at
    `

    return alert
}
export{
    AlertDataService,
    MarkAsReadService,
    MarkAllAsReadService,
    deleteAlertService
}