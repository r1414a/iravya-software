import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"


const addDriverService = async (data) => {
    const {
       full_name = "",
        phone = null,
        licence_no = null,
        licence_class = null,
        licence_expiry = null
    } = data;

    const nameParts = full_name.trim().split(/\s+/);
    const first_name = nameParts[0] || "Unknown";
    const last_name = nameParts.slice(1).join(" ") || ""; 
    const [newUser] = await sql`
        INSERT INTO "User"
    (
       
        "first_name",
        "last_name",
        "email",
        "role",
        "status"
    )
    VALUES
    (
       
        ${first_name},
        ${last_name},
        NULL,
        'driver',
        true
    )
    RETURNING
        "id",
        "first_name",
        "last_name",
        "email",
        "role",
        "status"
`;

    const driver = await sql`
        INSERT INTO "Drivers" (
        "licence_no",
        "licence_class",
        "licence_expiry",
        "user_id"
        )
        VALUES (
        ${licence_no},
        ${licence_class},
        ${licence_expiry},
        ${newUser.id}
        )
        RETURNING *
    `;

    return driver;
};
const driverExistBylicenceno = async(licence_no)=>{

    const driver = await sql`
        SELECT * FROM "Drivers"
        WHERE "licence_no" = ${licence_no}
    `
    return driver
}

const getDriverbyidService = async (id) => {
    const driver = await sql`
        SELECT * FROM "Drivers"
        WHERE "id" = ${id}
    `
    return driver
}

const updateDriverService = async (id, data) => {
    const {
        full_name,
        phone,
        licence_no,
        licence_class,
        licence_expiry
    } = data;

    const driver = await sql`
        UPDATE "Drivers"
        SET 
           "full_name" = ${full_name},
            "phone" = ${phone},
            "licence_no" = ${licence_no},
            "licence_class" = ${licence_class},
            "licence_expiry" = ${licence_expiry}
        WHERE "id" = ${id}
        RETURNING *
    `
    return driver
}

const deleteDriverService = async(id)=>{
    const driver = await sql`
        DELETE FROM "Drivers"
        WHERE "id" = ${id}
        RETURNING *
    `
    return driver
}

const getDriverCurrentTrip = async (driverId) => {
  const trip = await sql`
    SELECT 
        t.id AS trip_id,
        t.status,
        t.scheduled_at,
        t.departed_at,
        t.completed_at,
        t.completed_deliveries,
        t.tracking_code,

        d.full_name AS driver_name,
        d.phone AS driver_phone,

        tr.registration_no,
        tr.model,
        tr.capacity,

        dc.name AS source_dc_name,
        dc.city,
        dc.state

    FROM "Trips" t

    LEFT JOIN "Drivers" d 
        ON t.driver_id = d.id

    LEFT JOIN "Trucks" tr 
        ON t.truck_id = tr.id

    LEFT JOIN "Distribution_center" dc 
        ON t.source_dc_id = dc.id

    WHERE 
        t.driver_id = ${driverId}
        AND t.status != 'cancelled'

    ORDER BY 
        CASE 
            WHEN t.status = 'in_transit' THEN 1
            WHEN t.scheduled_at >= CURRENT_DATE 
            AND t.scheduled_at < CURRENT_DATE + INTERVAL '1 day' THEN 2
            WHEN t.scheduled_at > CURRENT_DATE THEN 3
            ELSE 4
        END,
        t.scheduled_at ASC

    LIMIT 1
  `;

  return trip;
};

const getDriverTripHistoryService = async (driverId) => {
  const trips = await sql`
    SELECT 
        t.id,
        t.status,
        t.scheduled_at,
        t.departed_at,
        t.completed_at,

        tr.registration_no,
        dc.name AS source_dc,

        COUNT(*) OVER() AS total_trips,

        COUNT(*) FILTER (
            WHERE DATE_TRUNC('month', t.scheduled_at) = DATE_TRUNC('month', CURRENT_DATE)
        ) OVER() AS trips_this_month,

        COUNT(*) FILTER (
            WHERE t.status = 'completed'
        ) OVER() AS completed_trips

    FROM "Trips" t

    LEFT JOIN "Trucks" tr 
        ON t.truck_id = tr.id

    LEFT JOIN "Distribution_center" dc 
        ON t.source_dc_id = dc.id

    WHERE 
        t.driver_id = ${driverId}

    ORDER BY t.scheduled_at DESC
    LIMIT 20
  `;

  return trips;
};

const getDriversListService = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const drivers = await sql`
    SELECT 
        d.id,
        d.full_name,
        d.phone,
        d.licence_no,
        d.licence_class,
        d.licence_expiry,
        d.created_at AS since,

        t.id AS current_trip,
        t.status AS trip_status,

        COUNT(tr.id) AS total_trips,

        COUNT(tr.id) FILTER (
            WHERE DATE_TRUNC('month', tr.scheduled_at) = DATE_TRUNC('month', CURRENT_DATE)
        ) AS trips_this_month,

        CASE 
            WHEN t.status = 'in_transit' THEN 'On trip'
            ELSE 'Available'
        END AS driver_status,

        COUNT(*) OVER() AS total_count

    FROM "Drivers" d

    LEFT JOIN "Trips" t 
        ON t.driver_id = d.id 
        AND t.status = 'in_transit'

    LEFT JOIN "Trips" tr 
        ON tr.driver_id = d.id

    GROUP BY 
        d.id,
        t.id,
        t.status

    ORDER BY d.created_at DESC

    LIMIT ${limit}
    OFFSET ${offset}
  `;
//   console.log(drivers)

  return {
    data: drivers,
    
      total: drivers[0]?.total_count || 0,
      page,
      limit,
      totalPages: Math.ceil((drivers[0]?.total_count || 0) / limit)
    
  };
};

const getDriversListeBySearchService = async (page = 1, limit = 10, search = "") => {
  const offset = (page - 1) * limit;

  const drivers = await sql`
    SELECT 
        d.id,
        d.full_name,
        d.phone,
        d.licence_no,
        d.licence_class,
        d.licence_expiry,
        d.created_at AS since,

        t.id AS current_trip,
        t.status AS trip_status,

        COUNT(tr.id) AS total_trips,

        COUNT(tr.id) FILTER (
            WHERE DATE_TRUNC('month', tr.scheduled_at) = DATE_TRUNC('month', CURRENT_DATE)
        ) AS trips_this_month,

        CASE 
            WHEN t.status = 'in_transit' THEN 'On trip'
            ELSE 'Available'
        END AS driver_status,

        COUNT(*) OVER() AS total_count

    FROM "Drivers" d

    LEFT JOIN "Trips" t 
        ON t.driver_id = d.id 
        AND t.status = 'in_transit'

    LEFT JOIN "Trips" tr 
        ON tr.driver_id = d.id

    WHERE 
        (
            ${search} = '' 
            OR d.full_name ILIKE ${'%' + search + '%'}
            OR d.phone ILIKE ${'%' + search + '%'}
        )

    GROUP BY 
        d.id,
        t.id,
        t.status

    ORDER BY d.created_at DESC

    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const total = drivers[0]?.total_count || 0;

  return {
    data: drivers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export{
    addDriverService,
    driverExistBylicenceno,
    getDriverbyidService,
    updateDriverService,
    deleteDriverService,
    getDriverCurrentTrip,
    getDriverTripHistoryService,
    getDriversListService,
    getDriversListeBySearchService

}


