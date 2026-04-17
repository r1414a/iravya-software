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
        INSERT INTO "User" ("email", "first_name", "last_name", "password", "role", "user_status")
    VALUES (${email}, ${first_name}, ${last_name}, ${hashedPassword}, ${role}, ${status})
    RETURNING "id", "first_name", "last_name", "email", "role", "user_status"
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

    await sql`
        UPDATE "User"
        SET "last_login" = NOW()
        WHERE "id" = ${user.id}
    `

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

const userExistbyidService = async (id) => {
    console.log(id)
    const userExists = await sql`
        SELECT "id", "email", "first_name", "last_name", "role", "last_login" 
        FROM "User" 
        WHERE "id" = ${id}
    `
    return userExists
}



const resetPasswordService = async (id, old_pass , new_pass)=>{
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(new_pass, salt)
    const user = (await sql`
        UPDATE "User"
        SET "password" = ${hashedPassword}
        WHERE "id" = ${id}
        RETURNING 
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
            "user_status",
            "last_login"
            RETURNING "id", "email", "first_name", "last_name", "role", "last_login"
    `)[0]
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
            <p>Password: ${new_pass}</p>
            <div >
                <a href="https://iravya-software-eight.vercel.app/">Signin to Your Account →</a>
            </div>
        `
    })
    return user[0]
}

const setUserPasswordService = async (data,id) => {
    const {password} =  data
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = (await sql`
        UPDATE "User"
        SET "password" = ${hashedPassword}
        WHERE "id" = ${id}
        RETURNING 
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
            "user_status",
            "last_login"
    `)[0]

    console.log(user);
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
            <p>Password: ${password}</p>
            <div >
                <a href="https://iravya-software-eight.vercel.app/">Signin to Your Account →</a>
            </div>
        `
    })
    return user;
}

const setUserStatusService = async(id, status)=>{

    const user = (await sql`
        UPDATE "User"
        SET "user_status" = ${status}
        WHERE "id" = ${id}
        RETURNING 
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
            "user_status",
            "last_login"
            RETURNING "id", "email", "first_name", "last_name", "role", "last_login"
    `)[0]

    return user
}

const getAllUserService = async(page = 1, limit = 10)=>{
    const offset = (page - 1) * limit
    const users = await sql
        `SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.role,
        u.last_login,
        u.created_at,
        u.updated_at,

        dc.name  AS dc_name,
        dc.city  AS dc_city,

        s.name   AS store_name,
        s.city   AS store_city,

        COUNT(*) OVER() AS total_count

    FROM "User" u

    LEFT JOIN "Distribution_center" dc 
        ON dc.dc_manager = u.id

    LEFT JOIN "Stores" s 
        ON s.store_manager = u.id

    ORDER BY u.created_at DESC

    LIMIT ${limit}
    OFFSET ${offset}
        `
    const [{ count }] = await sql`
        SELECT COUNT(*) FROM "User"
    `
    
    return {
        users,
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(count / limit)
    }
}

const getUserbySearchService = async(page = 1, limit = 10, search, role, status) =>{
    const offset = (page - 1) * limit

    // const users = await sql`
    //     SELECT 
    //         "id",
    //         "email",
    //         "first_name",
    //         "last_name",
    //         "role",
    //         "status",
    //         "last_login",
    //         "created_at",
    //         "updated_at",
    //         COUNT(*) OVER() AS total_count
    //     FROM "User"
    //     WHERE 1=1

    //     ${search ? sql`
    //     AND (
    //         "first_name" ILIKE ${'%' + search + '%'}
    //         OR "last_name" ILIKE ${'%' + search + '%'}
    //         OR "email" ILIKE ${'%' + search + '%'}
    //     )
    //     ` : sql``}

    //     ${role ? sql`AND "role" = ${role}` : sql``}

    //     ${status ? sql`AND "status" = ${status}` : sql``}

    //     ORDER BY "created_at" DESC
    //     LIMIT ${limit}
    //     OFFSET ${offset};
    // `;

    const users = await sql`
    SELECT 
        u."id",
        u."email",
        u."first_name",
        u."last_name",
        u."role",
        u."user_status",
        u."last_login",
        u."created_at",
        u."updated_at",

        -- ✅ Scope logic
        CASE 
            WHEN u."role" = 'dc_manager' THEN d."name"
            WHEN u."role" = 'store_manager' THEN s."name"
            ELSE NULL
        END AS scope,

        COUNT(*) OVER() AS total_count

    FROM "User" u

    -- ✅ Join DC table
    LEFT JOIN "Distribution_center" d 
        ON u."id" = d."dc_manager"

    -- ✅ Join Store table
    LEFT JOIN "Stores" s 
        ON u."id" = s."store_manager"

    WHERE 1=1

    ${search ? sql`
    AND (
        u."first_name" ILIKE ${'%' + search + '%'}
        OR u."last_name" ILIKE ${'%' + search + '%'}
        OR u."email" ILIKE ${'%' + search + '%'}
    )
    ` : sql``}

    ${role ? sql`AND u."role" = ${role}` : sql``}

    ${status ? sql`AND u."user_status" = ${status}` : sql``}

    ORDER BY u."created_at" DESC
    LIMIT ${limit}
    OFFSET ${offset};
`;

   const [{ count }] = await sql`
    SELECT COUNT(*) FROM "User" u
    WHERE 1=1
    ${search ? sql`
        AND (
            u."first_name" ILIKE ${'%' + search + '%'}
            OR u."last_name" ILIKE ${'%' + search + '%'}
            OR u."email" ILIKE ${'%' + search + '%'}
        )
    ` : sql``}
    ${role ? sql`AND u."role" = ${role}` : sql``}
    ${status ? sql`AND u."user_status" = ${status}` : sql``}
`;
    return {
        users,
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(count / limit)
    }
}

const updateUserService = async(id, data)=>{
     
    const user = (await sql`
            UPDATE "User"
            SET
                "first_name" = ${data.first_name},
                "last_name" = ${data.last_name},
                "email" = ${data.email},
                "role" = ${data.role},
                "user_status" = ${data.status}
            WHERE id = ${id}
            RETURNING "id", "email", "first_name", "last_name", "role", "last_login","created_at","updated_at"
                
        `)[0]

        return user
}

export {
    registerUserService,
    loginUserService, 
    deleteUserService,
    userExistbyemailService,
    userExistbyidService,
    resetPasswordService,
    setUserStatusService,
    getAllUserService,
    updateUserService,
    getUserbySearchService,
    setUserPasswordService
}