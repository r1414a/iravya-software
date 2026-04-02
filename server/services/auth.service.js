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
                <a href="https://iravya-software-eight.vercel.app/">Signin to Your Account →</a>
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

const userExistbyemailService = async (email) =>{
    const userExists = await sql`
        SELECT * FROM "User" WHERE "email" = ${email}
    `
    return userExists
}

const userExistbyidService = async (id) =>{
    const userExists = await sql`
        SELECT * FROM "User" WHERE "id" = ${id}
    `
    return userExists
}



const resetPasswordService = async (id, old_pass , new_pass)=>{
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(new_pass, salt)
    const user = await sql`
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
    await sendEmail({
        to: user.email,
        subject: "Welcome to Iravya | Password changed",
        html: `

            <p>Hi ${user.first_name},<br/>
            We wanted to let you know that your password has been changed,
            you can now log in to your account using your new password. </p>
            <p>Account Details:</p>
            <p>Name: ${user.first_name} ${user.last_name}</p>
            <p>Email: ${user.email}</p>
            <p>Password: ${user.password}</p>
            <div >
                <a href="https://iravya-software-eight.vercel.app/">Signin to Your Account →</a>
            </div>
        `
    })
    return user[0]
}

export {
    registerUserService,
    loginUserService, 
    deleteUserService,
    userExistbyemailService,
    userExistbyidService,
    resetPasswordService
}