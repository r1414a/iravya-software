import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"
import { sendEmail } from "../utils/mailer.js"
import asyncHandler from "../utils/asyncHandler.js"

const getUserDataService = async ({ page, limit, search }) => {
  const offset = (page - 1) * limit;

  const users = await sql`
    SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone_number,
        u.role,
        COUNT(*) OVER() AS total_count
        FROM "User" u
        LEFT JOIN "Distribution_center" dc 
        ON dc.dc_manager = u.id
        WHERE 
        u.role = 'dc_manager'
        AND dc.id IS NULL
        AND (
            u.first_name ILIKE ${"%" + search + "%"}
            OR u.last_name ILIKE ${"%" + search + "%"}
        )
        ORDER BY u.first_name ASC
        LIMIT ${limit}
        OFFSET ${offset}
    `;

  return {
    users,
    total: users[0]?.total_count || 0,
    page,
    limit,
  };
};
const addDcService = async(data) =>{
    const {name, address, city, state, dc_manager} = data
    
    // const name_= contact_name.split(" ")
    // const [newUser] = await sql`
    //     INSERT INTO "User"
    //     (
    //         "first_name",
    //         "last_name",
    //         "role",
    //         "email",
    //         "phone_number",
    //         "user_status"

    //     )
    //     VALUES
    //     (
        
    //         ${name_[0]},
    //         ${name_[1]},
    //         ${"dc_manager"},
    //         ${contact_email},
    //         ${contact_phone},
    //         ${"active"}
    //     )
    //     RETURNING
    //         "id",
    //         "first_name",
    //         "last_name",
    //         "email",
    //         "phone_number"
    //         "role",
    //         "user_status"
            
    // `;
    
    const dc = await sql`
        INSERT INTO "Distribution_center"
(
            "name",
            "address",
            "city",
            "state",
            "dc_manager"
            )
            VALUES
            (
            ${name},
            ${address},
            ${city},
            ${state},
            ${dc_manager}
            )
            RETURNING *
    `
    return dc
}

const dcByNameExist = async(name)=>{
    const dc = (await sql`
        SELECT * from "Distribution_center"
        WHERE "name" = ${name}
        
    `)
    console.log(dc)
    return dc
}

const getDcByIdService = async(id)=>{
    const dc = (await sql`
        SELECT * from "Distribution_center"
        WHERE "id" = ${id}
        
    `)
    console.log(dc)
    return dc
}

const updateDcService = async(id, data) =>{
    const {name, address, city, dc_manager, status} = data
    const dc = (await sql`
            UPDATE "Distribution_center"
            SET 
                "name" = ${name},
                "address" = ${address},
                "city" = ${city},
                "status" = ${status}
                "dc_manager" = ${dc_manager}
            WHERE "id" = ${id}
            RETURNING *
        `)

        // const name_ = contact_name?.split(" ") || [];
        // await sql`
        //     UPDATE "User"
        //     SET
        //         "first_name" = COALESCE(${name_[0]}, "first_name"),
        //         "last_name" = COALESCE(${name_[1] || ""}, "last_name"),
        //         "email" = COALESCE(${contact_email}, "email"),
        //         "phone_number" = COALESCE(${contact_phone}, "phone_number")
        //     WHERE "id" = (
        //         SELECT "dc_manager"
        //         FROM "Distribution_center"
        //         WHERE "id" = ${id}
        //     )
        //     `;

        return dc
}

const deleteDcService = async (id) => {
    const dc = await sql`
        DELETE  FROM "Distribution_center"
        WHERE "id" = ${id}
        RETURNING *

    `
    return dc
}

const getAllDcService = async(page, limit, search, dc_status)=>{
    const offset = (page - 1) * limit;
    const dc = await sql`

        SELECT 
            dc.id,
            dc.name AS dc_name,
            dc.city,
            dc.address,
            dc.status,
            dc.dc_manager,
            dc.created_at,

            CONCAT(u.first_name,' ',u.last_name) AS dc_manager_name,
            u.phone_number AS dc_manager_phone,
            u.email AS dc_manager_email,

            COUNT(DISTINCT tr.id) AS total_trips,
            COUNT(DISTINCT tr.id) FILTER (
                WHERE tr.status = 'in_transit' OR tr.status = 'scheduled'
            ) AS active_trips,

            COUNT(*) OVER() AS total_count

        FROM "Distribution_center" dc

        LEFT JOIN "User" u
        ON u.id = dc.dc_manager

        LEFT JOIN "GPS_devices" g
        ON g.dc_id = dc.id

        LEFT JOIN "Trips" tr
        ON tr.source_dc_id = dc.id

        WHERE 1=1

        ${dc_status ? sql`
        AND dc.status = ${dc_status}
        ` : sql``}

        ${search ? sql`
        AND (
            dc.name ILIKE ${'%' + search + '%'}
            OR dc.city ILIKE ${'%' + search + '%'}
        )
        ` : sql``}

        GROUP BY 
            dc.id,
            u.first_name,
            u.last_name,
            u.phone_number,
            u.email

        ORDER BY dc.created_at DESC

        LIMIT ${limit}
        OFFSET ${offset}

        `

        const total = dc.length ? Number(dc[0].total_count) : 0

        return {
            data: dc,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
}

export {
    addDcService,
    dcByNameExist,
    getDcByIdService,
    updateDcService,
    deleteDcService,
    getAllDcService,
    getUserDataService
}