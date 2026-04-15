import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"

const getUserDataService = async()=>{

    const users = await sql`
        SELECT 
            u.id,
            u.first_name,
            u.last_name,
            u.role

        FROM "User" u
        LEFT JOIN "Stores" s 
            ON s.store_manager = u.id

        WHERE 
            u.role = 'store_manager'
            AND s.id IS NULL
    `
    return users

}
const storeExistByStoreCode = async(store_code)=>{
    const [result] = await sql`
        SELECT EXISTS (
            SELECT 1 
            FROM "Stores"
            WHERE "store_code" = ${store_code}
        ) as "isExist"
    `

    return result.isExist
}

const addStoreService = async(data)=>{
<<<<<<< Updated upstream
    const {brand_id, name, address, city, state, latitude, longitude, manager_name, manager_phone, manager_email,store_code} = data
    const name_= manager_name.split(" ")
    const [newUser] = await sql`
        INSERT INTO "User"
        (
            "first_name",
            "last_name",
            "role",
            "email",
            "phone_number",
            "user_status"
        )
        VALUES
        (
        
            ${name_[0]},
            ${name_[1]},
            ${"store_manager"},
            ${manager_email},
            ${manager_phone},
            ${"active"}
        )
        RETURNING
            "id",
            "first_name",
            "last_name",
            "email",
            "phone_number"
            "role",
            "user_status"
    `;
console.log(newUser);
=======
    const {brand_id, name, address, city, state, latitude, longitude,store_code, store_manager} = data
    // const name_= manager_name.split(" ")
    // const [newUser] = await sql`
    //     INSERT INTO "User"
    //     (
    //         "first_name",
    //         "last_name",
    //         "role",
    //         "email",
    //         "phone_number",
    //         "status",

    //     )
    //     VALUES
    //     (
        
    //         ${name_[0]},
    //         ${name_[1]},
    //         ${"store_manager"},
    //         ${manager_email},
    //         ${manager_phone},
    //         true
    //     )
    //     RETURNING
    //         "id",
    //         "first_name",
    //         "last_name",
    //         "email",
    //         "phone_number"
    //         "role",
    //         "status"
    // `;
>>>>>>> Stashed changes

    const [newStore] = await sql`
        INSERT INTO "Stores" (
        "brand_id",
        "name",
        "address",
        "city",
        "state",
        "latitude",
        "longitude",
        "store_manager",
        "location",
        "store_code"
        )
        VALUES (
        ${brand_id},
        ${name},
        ${address},
        ${city},
        ${state},
        ${latitude},
        ${longitude},
<<<<<<< Updated upstream
        ${newUser.id},
=======
        ${store_manager}
>>>>>>> Stashed changes
        ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
        ${store_code}
        )
        RETURNING *;
    `;

    return newStore
}

const getStoreDataService = async(id)=>{

    const store = await sql`
        SELECT * FROM "Stores" 
        WHERE "id" = ${id}   
    `
    return store
}

const updateStoreService = async (id, data) => {
  const {
    brand_id,
    name,
    address,
    city,
    state,
    country,
    latitude,
    longitude,
    store_code,
    status
  } = data;

  const updateFields = {};
  
  if (brand_id) updateFields.brand_id = brand_id;
  if (store_code) updateFields.store_code = store_code;
  if (name) updateFields.name = name;
  if (address) updateFields.address = address;
  if (city) updateFields.city = city;
  if (state) updateFields.state = state;
  if (country) updateFields.country = country;
  if (latitude) updateFields.latitude = latitude;
  if (longitude) updateFields.longitude = longitude;
  if (status) updateFields.status = status;

  // Location update
  if (latitude && longitude) {
    updateFields.location = sql`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`
  }

  updateFields.updated_at = sql`NOW()`;

  const [updatedStore] = await sql`
    UPDATE "Stores"
    SET ${sql(updateFields)}
    WHERE "id" = ${id}
    RETURNING *
  `;

  // Manager Update
  const { manager_name, manager_phone, manager_email } = data;

  if (manager_name || manager_phone || manager_email) {
    const name_ = manager_name?.split(" ") || [];

    await sql`
      UPDATE "User"
      SET
        "first_name" = COALESCE(${name_[0]}, "first_name"),
        "last_name" = COALESCE(${name_[1] || ""}, "last_name"),
        "email" = COALESCE(${manager_email}, "email"),
        "phone_number" = COALESCE(${manager_phone}, "phone_number")
      WHERE "id" = (
        SELECT "store_manager"
        FROM "Stores"
        WHERE "id" = ${id}
      )
    `;
  }
  return updatedStore;
};

const deleteStoreService = async(id)=>{
    const store = await sql`
        DELETE FROM "Stores"
        WHERE "id" = ${id}
    `
    return store
  }

const deleveryDetailService = async (id) => {
    const trips = await sql`
    SELECT 
        t.id AS trip_id,
        t.tracking_code,
        t.status AS trip_status,
        t.departed_at,
        
        dc.name AS dc_name,
        
        tr.registration_no AS truck_number,
        
        CONCAT(u.first_name, ' ', u.last_name) AS driver_name

    FROM "Trips" t

    JOIN "Trip_stops" ts 
        ON ts.trip_id = t.id

    JOIN "Distribution_center" dc 
        ON dc.id = t.source_dc_id

    LEFT JOIN "Trucks" tr 
        ON tr.id = t.truck_id

    LEFT JOIN "Drivers" d 
        ON d.id = t.driver_id

    LEFT JOIN "User" u
        ON u.id = d.user_id

    WHERE ts.store_id = ${id}

    ORDER BY t.departed_at DESC

    LIMIT 5
    `;
    return trips
}

const getAllStoreService = async (filters) => {
    const {
        brand_id,
        status,
        city,
        search,
        page = 1,
        limit = 10,
        user_id
    } = filters;

    const offset = (page - 1) * limit;
    // const [dc] = await sql`
    //         SELECT "id" FROM "Distribution_center" WHERE "dc_manager" = ${user_id}
    //     `
    // const dcID = dc?.id || null

    const stores = await sql`
        SELECT 
        s.id,
        s.name,
        s.address,
        s.city,
        s.brand_id,
        s.status,
        s.store_code,

        b.name AS brand_name,

        CONCAT(u.first_name, ' ', u.last_name) AS manager_name,
        u.phone_number AS manager_phone,
        u.email AS manager_email,

        COUNT(t.id) FILTER (
            WHERE DATE(t.departed_at) = CURRENT_DATE
        ) AS today_deliveries,

        COUNT(t.id) AS total_deliveries

    FROM "Stores" s

    LEFT JOIN "Brand" b
        ON b.id = s.brand_id

    LEFT JOIN "User" u
        ON u.id = s.store_manager

    LEFT JOIN "Trip_stops" ts
        ON ts.store_id = s.id

    LEFT JOIN "Trips" t
        ON t.id = ts.trip_id

    WHERE 1=1
    

    ${brand_id ? sql`
    AND s.brand_id = ${brand_id}
    ` : sql``}

    ${status ? sql`
    AND s.status = ${status}
    ` : sql``}

    ${city ? sql`
    AND s.city = ${city}
    ` : sql``}

    ${search ? sql`
    AND s.search_vector @@ plainto_tsquery('english', ${search})
    ` : sql``}

    GROUP BY 
        s.id,
        b.name,
        u.first_name,
        u.last_name,
        u.phone_number,
        u.email

    ORDER BY s.created_at DESC

    LIMIT ${limit}
    OFFSET ${offset}
    `;

    return {
        data: stores,
        total: stores[0]?.total_count || 0,
        page,
        limit,
        total_pages: Math.ceil((stores[0]?.total_count || 0) / limit)
    };
};
    




export{
    addStoreService,
    storeExistByStoreCode,
    getStoreDataService,
    updateStoreService,
    deleteStoreService,
    deleveryDetailService,
    getAllStoreService,
    getUserDataService
}