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


const document_stattus = async(expiry_date)=>{
    const today = new Date()
    const expiry = new Date(expiry_date)

    // Remove time for accurate day comparison
    today.setHours(0,0,0,0)
    expiry.setHours(0,0,0,0)

    const diffTime = expiry - today
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (daysRemaining <= 0) {
        return "expired"
    }

    if (daysRemaining <= 30) {
        return "expiring"
    }

    return "valid"
}


const addTruckservice = async (data) => {
    const {
        registration_no,
        model,
        type,
        capacity,
        registration_cert,
        insurance_doc,
        PUC_cert,
        rc_expiry,
        insurance_expiry,
        puc_expiry
    } = data;
    
    const [truck] = await sql`
        INSERT INTO "Trucks"
        (
            "registration_no",
            "model",
            "type",
            "capacity"
           
        )
        VALUES
        (
            ${registration_no},
            ${model},
            ${type},
            ${capacity}
            
        )
        RETURNING *
    `;

    const documents = await sql`
        INSERT INTO "truck_documents" (
            file_url,
            expiry_date,
            document_status,
            doc_type,
            truck_id
        )
        VALUES (
            ${registration_cert},
            ${rc_expiry},
            ${await document_stattus(rc_expiry)},
            'registration_cert',
            ${truck.id}
        ),
        (
            ${insurance_doc},
            ${insurance_expiry},
            ${await document_stattus(insurance_expiry)},
            'insurance_doc',
            ${truck.id}
        ),
        (
            ${PUC_cert},
            ${puc_expiry},
            ${await document_stattus(puc_expiry)},
            'PUC_cert',
            ${truck.id}
        )
        RETURNING *;
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
        SELECT 
            t.*, 
            json_agg(
            json_build_object(
                'file_url', td.file_url,
                'doc_type', td.doc_type,
                'document_status', td.document_status,
                'expiry_date', td.expiry_date
            )
            ) AS documents
        FROM "Trucks" t
        LEFT JOIN "truck_documents" td
            ON t.id = td.truck_id
        WHERE t.id = ${id}
        GROUP BY t.id
    `
    return truck
}
const updateTruckDataService = async (id, data) => {

    const {
    registration_no,
    model,
    type,
    capacity,
    truck_status,
    registration_cert = null,
    insurance_doc = null,
    PUC_cert = null,
    rc_expiry = null,
    insurance_expiry = null,
    puc_expiry = null
  } = data;

  // Update Truck
    const [truck] = await sql`
        UPDATE "Trucks"
        SET
        registration_no = ${registration_no},
        model = ${model},
        type = ${type},
        capacity = ${capacity},
        status = ${truck_status}
        WHERE id = ${id}
        RETURNING *
    `;

    // Update Registration Certificate
    await sql`
        UPDATE "truck_documents"
        SET
        file_url = ${registration_cert},
        expiry_date = ${rc_expiry},
        document_status = ${await document_stattus(rc_expiry)}
        WHERE truck_id = ${id}
        AND doc_type = 'registration_cert'
    `;

    // Update Insurance
    await sql`
        UPDATE "truck_documents"
        SET
        file_url = ${insurance_doc},
        expiry_date = ${insurance_expiry},
        document_status = ${await document_stattus(insurance_expiry)}
        WHERE truck_id = ${id}
        AND doc_type = 'insurance_doc'
    `;

    // Update PUC
    await sql`
        UPDATE "truck_documents"
        SET
        file_url = ${PUC_cert},
        expiry_date = ${puc_expiry},
        document_status = ${await document_stattus(puc_expiry)}
        WHERE truck_id = ${id}
        AND doc_type = 'PUC_cert'
    `;

    return truck;
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

const getAllTruckDataService = async ({ type, truck_status, search, page, limit, user_id}) => {
    const offset = (page - 1) * limit

    console.log(user_id)
    const [dc] = await sql`
        SELECT "id" FROM "Distribution_center" WHERE "dc_manager" = ${user_id}
    `
    const dcId = dc?.id || null
    console.log("dcId:", dcId)
    const trucks = await sql`
        SELECT 
            tr.id, tr.registration_no, tr.type, tr.capacity, tr.model, tr.status,
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