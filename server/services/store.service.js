import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"


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
    const {brand_id, name, address, city, state, country, latitude, longitude, manager_name, manager_phone, manager_email,store_code} = data
    const name_= manager_name.split(" ")
    const [newUser] = await sql`
        INSERT INTO "User"
        (
            "first_name",
            "last_name",
            "role",
            "email",
            "phone_number",
            "status",

        )
        VALUES
        (
        
            ${name_[0]},
            ${name_[1]},
            ${"store_manager"},
            ${manager_email},
            ${manager_phone},
            true
        )
        RETURNING
            "id",
            "first_name",
            "last_name",
            "email",
            "phone_number"
            "role",
            "status"
    `;

    const [newStore] = await sql`
        INSERT INTO "Stores" (
        "brand_id",
        "name",
        "address",
        "city",
        "state",
        "country",
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
        ${country},
        ${latitude},
        ${longitude},
        ${newUser.id},
        ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)
        )
        RETURNING *;
    `;

    return newStore
}



export{
    addStoreService,
    storeExistByStoreCode
}