import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"
import { sendEmail } from "../utils/mailer.js"
import asyncHandler from "../utils/asyncHandler.js"


const addDcService = async(data) =>{
    const {name, address, city, state, country, contact_name, contact_phone, contact_email, is_active} = data
    const dc = await sql`
        INSERT INTO "Distribution_center"
(
            "name",
            "address",
            "city",
            "state",
            "country",
            "contact_name",
            "contact_phone",
            "contact_email",
            "is_active"
            )
            VALUES
            (
            ${data.name},
            ${data.address},
            ${data.city},
            ${data.state},
            ${data.country},
            ${data.contact_name},
            ${data.contact_phone},
            ${data.contact_email},
            ${data.is_active}
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
    const {name, address, city, state, country, contact_name, contact_phone, contact_email, is_active} = data
    const dc = (await sql`
            UPDATE "Distribution_center"
            SET 
                "name" = ${name},
                "address" = ${address},
                "city" = ${city},
                "state" = ${state},
                "country" = ${country},
                "contact_name" = ${contact_name},
                "contact_phone" = ${contact_phone},
                "contact_email" = ${contact_email},
                "is_active" = ${is_active}
            WHERE "id" = ${id}
            RETURNING *
        `)

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

export {
    addDcService,
    dcByNameExist,
    getDcByIdService,
    updateDcService,
    deleteDcService
}