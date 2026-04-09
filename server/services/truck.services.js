import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"
import supabase from "../config/supabase.js"

const uploadFile = async (file, folder) => {

    const fileName =
        `${folder}/${Date.now()}-${file.originalname}`

    const { error } = await supabase
        .storage
        .from("Documents")
        .upload(fileName, file.buffer, {
            contentType: file.mimetype
        })

    if (error) throw error

    const { data } = supabase
        .storage
        .from("Documents")
        .getPublicUrl(fileName)

    return data.publicUrl
}


const addTruckservice = async (data) => {
    const {
        registration_no,
        model,
        type,
        capacity,
        registration_cert,
        insurance_doc,
        PUC_cert
    } = data;

    const [truck] = await sql`
        INSERT INTO "Trucks"
        (
            "registration_no",
            "model",
            "type",
            "capacity",
            "registration_cert",
            "insurance_doc",
            "PUC_cert"
        )
        VALUES
        (
            ${registration_no},
            ${model},
            ${type},
            ${capacity},
            ${registration_cert},
            ${insurance_doc},
            ${PUC_cert}
        )
        RETURNING *
    `;

    return truck;

}

const truckExistByRegNoService = async (registration_no) => {

    const [result] = await sql`
        SELECT EXISTS (
            SELECT 1 
            FROM "Trucks"
            WHERE "registration_no" = ${registration_no}
        ) as "isExist"
    `

    return result.isExist
}

const truckExistByIDService = async (id) => {
    console.log(id)
    const [result] = await sql`
        SELECT EXISTS (
            SELECT 1 
            FROM "Trucks"
            WHERE "id" = ${id}
        ) as "isExist"
    `

    return result.isExist
}

const getTruckDataService = async (id) => {
    const [truck] = await sql`
        SELECT * FROM "Trucks"
        WHERE "id" = ${id}

    `
    return truck
}
const updateTruckDataService = async (id, data) => {

    const updateFields = []
    const values = []

    let index = 1

    for (const key in data) {
        if (data[key] !== undefined) {
            updateFields.push(`"${key}" = $${index}`)
            values.push(data[key])
            index++
        }
    }

    if (updateFields.length === 0) {
        throw new Error("No fields to update")
    }

    values.push(id)

    const query = `
        UPDATE "Trucks"
        SET ${updateFields.join(", ")},
        "updated_at" = NOW()
        WHERE "id" = $${index}
        RETURNING *
    `

    const [truck] = await sql.unsafe(query, values)

    return truck
}

const deleteTruckService = async (id) => {
    const [truck] = await sql`
        DELETE FROM "Trucks"
        WHERE "id" = ${id}
        RETURNING *
    `

    return truck
}

const getRecentTripDetailsService = async (trip_id) => {

    const trip = await sql`
        SELECT 
            t.trip_code,
            t.status,
            tr.registration_no,
            d.full_name,
            g.device_name,
            dc.name as source_dc,
            ts.stop_name,
            t.departed_at,
            t.eta

        FROM "Trips" t

        LEFT JOIN "Trucks" tr 
            ON t.truck_id = tr.id

        LEFT JOIN "Drivers" d 
            ON t.driver_id = d.id

        LEFT JOIN "GPS_Devices" g 
            ON t.gps_id = g.id

        LEFT JOIN "Distribution_Centers" dc 
            ON t.source_dc_id = dc.id

        LEFT JOIN "Trip_Stops" ts 
            ON ts.trip_id = t.id

        WHERE t.id = ${trip_id}

        ORDER BY ts.sequence_no
    `

    return trip
}

const getTripHistoryService = async (id) => {
    const trips = await sql`
        SELECT 
            t.id,
            t.trip_code,
            t.status,
            t.started_at,
            t.completed_at,

            source_dc.name as source,

            STRING_AGG(
                st.stop_name, 
                ' → ' 
                ORDER BY st.sequence_no
            ) as stops,

            destination_dc.name as destination

        FROM "Trips" t

        LEFT JOIN "Distribution_Centers" source_dc
            ON t.source_dc_id = source_dc.id

        LEFT JOIN "Distribution_Centers" destination_dc
            ON t.destination_dc_id = destination_dc.id

        LEFT JOIN "Trip_Stops" st
            ON st.trip_id = t.id

        WHERE t.truck_id = ${truck_id}

        GROUP BY 
            t.id,
            source_dc.name,
            destination_dc.name

        ORDER BY t.started_at DESC
    `

    return trips
}

const getAllTruckDataService = async ({ type, truck_status, search, page, limit }) => {
    const offset = (page - 1) * limit

    // FIX 1: Build query conditionally — don't apply search filter when search is null
    // FIX 2: pagination object was missing the opening brace — page/limit/total_pages were outside
    const trucks = await sql`
        SELECT 
            tr.id, tr.registration_no, tr.type, tr.capacity, tr.model, tr.status, tr."registration_cert", tr."insurance_doc", tr."PUC_cert",
            COUNT(t.id) AS total_trips,
            MAX(t.departed_at) AS last_trip
        FROM "Trucks" tr
        LEFT JOIN "Trips" t ON t.truck_id = tr.id
        WHERE 1=1
            AND (${type}::text IS NULL OR tr.type = ${type})
            AND (${truck_status}::text IS NULL OR tr.status = ${truck_status})
            AND (
                ${search}::text IS NULL
                OR tr.registration_no ILIKE ${'%' + (search || '') + '%'}
                OR tr.search_vector @@ plainto_tsquery('simple', ${search || ''})
            )
        GROUP BY tr.id, tr.registration_no, tr.type, tr.model, tr.status
        ORDER BY last_trip DESC NULLS LAST
        LIMIT ${limit} OFFSET ${offset}
    `

    const [countRow] = await sql`
        SELECT COUNT(*) FROM "Trucks" tr
        WHERE 1=1
            AND (${type}::text IS NULL OR tr.type = ${type})
            AND (${truck_status}::text IS NULL OR tr.status = ${truck_status})
            AND (
                ${search}::text IS NULL
                OR tr.registration_no ILIKE ${'%' + (search || '') + '%'}
                OR tr.search_vector @@ plainto_tsquery('simple', ${search || ''})
            )
    `

    const total = Number(countRow.count)

    return {
        data: trucks,
        pagination: {       // FIX 2: was missing opening brace here
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    }
}

// const getAllTruckDataService = async({type, truck_status, search, page,
//     limit})=>{
//     const offset = (page - 1) * limit
//     console.log(page, limit)
//     let query = sql`
//         SELECT 
//             tr.id,
//             tr.registration_no,
//             tr.type,
//             tr.model,
//             tr.status,
//             COUNT(t.id) AS total_trips,
//             MAX(t.departed_at) AS last_trip

//         FROM "Trucks" tr
//         LEFT JOIN "Trips" t 
//             ON t.truck_id = tr.id
//         WHERE 1=1
//     `

//     if (type) {
//         query = sql`${query} AND tr.type = ${type}`
//     }

//     if (truck_status) {
//         query = sql`${query} AND tr.status = ${truck_status}`
//     }

//     query = sql`
//         ${query}
//         AND (
//             tr.search_vector @@ plainto_tsquery('simple', ${search})
//             OR tr.registration_no ILIKE ${'%' + search + '%'}
//         )
//     `

//     query = sql`
//         ${query}
//         GROUP BY 
//             tr.id,
//             tr.registration_no,
//             tr.type,
//             tr.model,
//             tr.status
//         ORDER BY last_trip DESC NULLS LAST
//         LIMIT ${limit}
//         OFFSET ${offset}
//     `

//     const trucks = await query

//     const totalCount = await sql`

//         SELECT COUNT(*) 

//         FROM "Trucks" tr

//         WHERE 
//             (${type}::text IS NULL OR tr.type = ${type})
//         AND
//             (${truck_status}::text IS NULL OR tr.status = ${truck_status})
//         AND
//             (${search}::text IS NULL 
//                 OR tr.search_vector @@ plainto_tsquery('simple', ${search})
//             )
//     `


//     const total = Number(totalCount[0].count)

//     return {
//         data: trucks,
//         pagination: 
//             total,
//             page,
//             limit,
//             total_pages: Math.ceil(total / limit)
//         }

// }

export {
    addTruckservice,
    uploadFile,
    truckExistByRegNoService,
    getTruckDataService,
    truckExistByIDService,
    updateTruckDataService,
    deleteTruckService,
    getRecentTripDetailsService,
    getTripHistoryService,
    getAllTruckDataService
}