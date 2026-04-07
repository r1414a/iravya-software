import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"

const allBrandService = async()=>{
    const brands = await sql`
        SELECT * FROM "Brand"
    `
    return brands
}

export{
    allBrandService
}