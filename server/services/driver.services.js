import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"


const addDriverService = async (data) => {
    const {
        first_name,
        last_name,
        phone_number,
        licence_no,
        licence_class,
        licence_expiry,
        status = "available"
    } = data;

    const [newUser] = await sql`
        INSERT INTO "User"
        (
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "role",
            "user_status"
        )
        VALUES
        (
            ${first_name},
            ${last_name},
            NULL,
            ${phone_number},
            'driver',
            'active'
        )
        RETURNING id
    `;

    const [driver] = await sql`
        INSERT INTO "Drivers" (
            "licence_no",
            "licence_class",
            "licence_expiry",
            "user_id",
            "status"
        )
        VALUES (
            ${licence_no},
            ${licence_class},
            ${licence_expiry},
            ${newUser.id},
            ${status}
        )
        RETURNING *
    `;

    return driver;
};


const driverExistBylicenceno = async (licence_no) => {

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
        first_name,
        last_name,
        phone_number,
        licence_no,
        licence_class,
        licence_expiry,
        status
    } = data;

    const current = await sql`
    SELECT status FROM "Drivers" WHERE id = ${id}
`;

    if (current[0]?.status === "on_trip" && status !== "on_trip") {
        throw new ApiError(400, "Cannot change status while driver is on trip");
    }

    // ✅ Update driver table
    const [driver] = await sql`
        UPDATE "Drivers"
        SET 
            "licence_no" = ${licence_no},
            "licence_class" = ${licence_class},
            "licence_expiry" = ${licence_expiry},
            "status" = ${status}
        WHERE "id" = ${id}
        RETURNING *
    `;

    // ✅ Update user table
    await sql`
        UPDATE "User"
        SET
            "first_name" = COALESCE(${first_name}, "first_name"),
            "last_name" = COALESCE(${last_name}, "last_name"),
            "phone_number" = COALESCE(${phone_number}, "phone_number")
        WHERE "id" = (
            SELECT "user_id"
            FROM "Drivers"
            WHERE "id" = ${id}
        )
    `;

    return driver;
};

const deleteDriverService = async (id) => {
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

    -- Driver details from User table
    (u.first_name || ' ' || u.last_name) AS driver_name,
    u.phone_number,

    tr.registration_no,
    tr.model,
    tr.capacity,

    dc.name AS source_dc_name,
    dc.city,
    dc.state,

    stops_data.stops

FROM "Trips" t

JOIN "Drivers" d 
    ON t.driver_id = d.id

JOIN "User" u 
    ON d.user_id = u.id

JOIN "Trucks" tr 
    ON t.truck_id = tr.id

JOIN "Distribution_center" dc 
    ON t.source_dc_id = dc.id

LEFT JOIN LATERAL (
    SELECT json_agg(
        json_build_object(
            'store_name', s.name,
            'status', ts.status,
            'eta', ts.eta,
            'arrived_at', ts.arrived_at
        )
        ORDER BY ts.created_at
    ) AS stops
    FROM "Trip_stops" ts
    JOIN "Stores" s ON ts.store_id = s.id
    WHERE ts.trip_id = t.id
) stops_data ON true

WHERE 
    t.driver_id = ${driverId}
    AND t.status IN ('scheduled', 'in_transit')

ORDER BY 
    CASE 
        WHEN t.status = 'in_transit' THEN 1
        WHEN t.status = 'scheduled' 
             AND t.scheduled_at >= NOW() 
             AND t.scheduled_at < NOW() + INTERVAL '1 day' THEN 2
        WHEN t.status = 'scheduled' 
             AND t.scheduled_at > NOW() THEN 3
        ELSE 4
    END,
    COALESCE(t.scheduled_at, t.departed_at, t.created_at)

LIMIT 1;
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

const getDriversListService = async (page = 1, limit = 10, user_id) => {
    const offset = (page - 1) * limit;

    const [dc] = await sql`
        SELECT "brand_id" FROM "Distribution_center" WHERE "dc_manager" = ${user_id}
    `
    const brandId = dc?.brand_id || null
    const drivers = await sql`
    SELECT 
        d.id,
        CONCAT(u.first_name, ' ', u.last_name) AS full_name,
        u.first_name,
        u.last_name,
        u.email,
        u.phone_number,
        d.licence_no,
        d.licence_class,
        d.licence_expiry,
        d.status,
        d.total_trips,
        d.created_at AS since,

        t.id AS current_trip,
        t.status AS trip_status,

        COUNT(DISTINCT tr.id) AS total_trips,

        COUNT(DISTINCT tr.id) FILTER (
    WHERE DATE_TRUNC('month', tr.scheduled_at) = DATE_TRUNC('month', CURRENT_DATE)
) AS trips_this_month,

        CASE 
            WHEN d.status = 'on_trip' THEN 'On trip'
            WHEN d.status = 'inactive' THEN 'Inactive'
            ELSE 'Available'
        END AS driver_status,

        d.brand_id = ${brandId}

        COUNT(*) OVER() AS total_count

    FROM "Drivers" d

    INNER JOIN "User" u
        ON d.user_id = u.id

    LEFT JOIN "Trips" t 
        ON t.driver_id = d.id 
        AND t.status = 'in_transit'

    LEFT JOIN "Trips" tr 
        ON tr.driver_id = d.id

    GROUP BY 
        d.id,
        u.id,
        t.id,
        t.status

    ORDER BY d.created_at DESC

    LIMIT ${limit}
    OFFSET ${offset}
  `;
    //   console.log(drivers)

    return {
        data: drivers,
        total: Number(drivers[0]?.total_count || 0),
        page,
        limit,
        totalPages: Math.ceil((drivers[0]?.total_count || 0) / limit)
    };
};

const getDriversListeBySearchService = async (
    page = 1,
    limit = 10,
    search = "",
    user_id,
    role,
    status,
    licence_class
) => {
    const offset = (page - 1) * limit;
    const searchPattern = `%${search}%`;

    let dcId = null;

    // ✅ Only for DC Manager
    if (role !== "super_admin") {
        const [dc] = await sql`
      SELECT "id" FROM "Distribution_center"
      WHERE "dc_manager" = ${user_id}
    `;
        dcId = dc?.id;

        if (!dcId) {
            throw new Error("No DC assigned to this manager");
        }
    }

    const drivers = await sql`
    SELECT 
      d.id,
      u.first_name,
      u.last_name,
      CONCAT(u.first_name, ' ', u.last_name) AS full_name,
      u.phone_number,
      d.licence_no,
      d.licence_class,
      d.licence_expiry,
      d.created_at AS since,

      -- ✅ Current active trip (no duplicates)
      t.id AS current_trip_id,
      t.status AS trip_status,
      t.tracking_code AS current_trip_tracking_code,

      -- ✅ Total trips (global)
      (SELECT COUNT(*) 
       FROM "Trips" 
       WHERE driver_id = d.id
      ) AS total_trips,

      -- ✅ Trips this month (role-based)
      (SELECT COUNT(*) 
       FROM "Trips"
       WHERE driver_id = d.id
       ${role !== "super_admin" ? sql`AND source_dc_id = ${dcId}` : sql``}
       AND DATE_TRUNC('month', scheduled_at) = DATE_TRUNC('month', CURRENT_DATE)
      ) AS trips_this_month,

      CASE 
        WHEN t.id IS NOT NULL THEN 'On trip'
        WHEN d.status = 'inactive' THEN 'Inactive'
        ELSE 'Available'
      END AS driver_status,

      COUNT(*) OVER() AS total_count

    FROM "Drivers" d
    INNER JOIN "User" u ON d.user_id = u.id

    -- ✅ Prevent duplicate rows
    LEFT JOIN LATERAL (
      SELECT id, status, tracking_code
      FROM "Trips"
      WHERE driver_id = d.id AND status = 'in_transit'
      LIMIT 1
    ) t ON TRUE

    WHERE 
      (${search} = '' OR (
        u.first_name ILIKE ${searchPattern} OR 
        u.last_name ILIKE ${searchPattern} OR 
        u.phone_number ILIKE ${searchPattern} OR 
        d.licence_no ILIKE ${searchPattern}
      ))

      -- ✅ KEY FIX: DC manager restriction via trips
      ${role !== "super_admin" ? sql`
        AND EXISTS (
          SELECT 1 FROM "Trips" t2
          WHERE t2.driver_id = d.id
          AND t2.source_dc_id = ${dcId}
        )
      ` : sql``}

      AND (${status ? sql`d.status = ${status}` : sql`TRUE`})
      AND (${licence_class ? sql`d.licence_class = ${licence_class}` : sql`TRUE`})

    ORDER BY d.created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

    const total = parseInt(drivers[0]?.total_count || 0);

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



export {
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


