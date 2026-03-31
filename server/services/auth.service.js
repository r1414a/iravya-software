import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"

const registerUserService = async (userData) => {

    const { first_name, last_name, email, password, role, status } = userData

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Check user exists
    const userExists = await sql`
        SELECT * FROM users WHERE email = ${email}
    `

    if (userExists.length) {
        throw new Error("User already exists")
    }

    // Insert user
    const newUser = await sql`
        INSERT INTO users (email, first_name, last_name, password, role, status)
        VALUES (${email}, ${first_name}, ${last_name}, ${hashedPassword}, ${role}, ${status})
        RETURNING id, first_name, last_name, email, role, status
    `

    return newUser[0]
}


const loginUserService = async (email, password) => {

    const users = await sql`
        SELECT * FROM users WHERE email = ${email}
    `

    if (!users.length) {
        throw new ApiError(401,"Invalid credentials")
    }

    const user = users[0]

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new ApiError(401,"Invalid credentials")
    }

    return user
}


export {
    registerUserService,
    loginUserService
}