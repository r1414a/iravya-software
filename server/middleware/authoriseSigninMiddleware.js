import asyncHandler from "../utils/asyncHandler.js"
import sql from "../db/database.js"

export const authorizeSihnin = (status) => {
    return asyncHandler(async (req, res, next) => {

        
        const {email} = req.body;
        const user_status = (await sql`
                SELECT "status" from "User" where "email" = ${email}

            `)[0]

        // console.log(user_status.status, status, )
        if (status !== user_status.status) {
            return res.status(403).json({
                message: "Access denied. You don't have permission"
            })
        }

        next()
    })
}