import bcrypt from "bcryptjs"
import sql from "../db/database.js"
import ApiError from "../utils/ApiError.js"
import { sendEmail } from "../utils/mailer.js"

const registerUserService = async (userData) => {
    const { first_name, last_name, email, password, role, status } = userData
    console.log(first_name, last_name, email, password, role, status)

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)


    // Insert user
    const newUser = await sql`
        INSERT INTO "User" ("email", "first_name", "last_name", "password", "role", "status")
    VALUES (${email}, ${first_name}, ${last_name}, ${hashedPassword}, ${role}, ${status})
    RETURNING "id", "first_name", "last_name", "email", "role", "status"
    `
    await sendEmail({
        to: email,
        subject: "Welcome to Iravya | Account Creation",
        html: `
            <h2>Welcome ${first_name}</h2>
            <p>Thank you for registering with Iravya. Your account has been created successfully. 
            Below are the details you submitted during signup — please keep them safe and do not share your credentials 
            with anyone.</p>
            <p>Your Signup Details</p>
            <p>Name: ${first_name} ${last_name}</p>
            <p>Email: ${email}</p>
            <p>Password: ${password}</p>
            <div >
                <a href="https://iravya-software-eight.vercel.app/">Login to Your Account →</a>
            </div>
        `
    })
    return newUser[0]
}

const loginUserService = async (email, password) => {
    const users = await sql`
        SELECT * FROM "User" WHERE "email" = ${email}
    `
    const user = users[0]

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new ApiError(401,"Invalid credentials")
    }

    return user
}

const deleteUserService= async(user_id) =>{  
    const user = await sql`
        DELETE FROM "User"
        WHERE "id" = ${user_id}
        RETURNING "id", "email", "first_name", "last_name", "role", "last_login"
    `
    return user[0]
}

const userExistService = async (email) =>{
    const userExists = await sql`
        SELECT * FROM "User" WHERE "email" = ${email}
    `
    return userExists
}

const resetPasswordService = async (id, old_pass , new_pass)=>{
    
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(new_pass, salt)

    const newUser = await sql`
        UPDATE "User"
        SET "password" = ${hashedPassword}
        WHERE "id" = ${id}
        RETURNING 
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
            "status",
            "last_login"
    `
    return newUser[0]
}

export {
    registerUserService,
    loginUserService, 
    deleteUserService,
    userExistService
}