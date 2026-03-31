import bcrypt from "bcryptjs";
// const sendEmail = require('../utils/sendEmail')
import sql from '../db/database.js'
// import { asyncHandler } from '../utils/asyncHandler'
import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse,js";


// const generateToken = (id) =>{
//     return jwt.sign({id},JWT_SECRET,{
//         expiresIn : '30d',
//     })
// }

// const registerUser = asyncHandler(async (req, res) => {
//     const { first_name, last_name, email, password, role, status } = req.body

//     if (!email || !password) {
//         res.status(400)
//         throw new Error('Please add all the details')
//     }

//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password, salt)


//     // Check if user exists
//     const userExists = await sql`
//         SELECT * FROM users WHERE uniid = ${uniid}
//     `

//     if (userExists.length) {
//         res.status(400).send({
//             success: false,
//             message: 'User already exists'
//         })
//         throw new Error('User already exists')
//     }

//     // Insert User
//     const newUser = await sql`
//         INSERT INTO users (email, first_name, last_name, password, role, status)
//         VALUES (${email}, ${first_name}, ${last_name } ${hashedPassword}, ${role}, ${status})
//         RETURNING first_name, last_name, email, role, status 
//     `

//     const user = newUser[0]



//     if (user) {
        
//         res.status(201).send({
//             success: true,
//             message: "User registered successfully",
//             _id: user.id,
//             email: user.email,
//             first_name: user.first_name,
//             last_name: user.last_name,
//             role: user.role,
//             token: generateToken(user.id)
//         })
//     }
//     else {
//         res.status(400)
//         throw new Error('Invalid user data')
//     }
// })



// const loginUser = asyncHandler(async (req, res) => {
//     const { email, password } = req.body

//     const users = await sql`
//         SELECT * FROM users WHERE email = ${email}
//     `

//     if (!users.length) {
//         res.status(401)
//         throw new Error('Invalid credentials')
//     }

//     const user = users[0]

//     const isMatch = await bcrypt.compare(password, user.password)

//     if (isMatch) {
//         const token = generateToken(user.id)
//         res
//         .status(200)
//         .cookie("token", token, options)
//         .json({
//             success: true,
//             message: "User loged in successfully",
//             _id: user.id,
//             email: user.email,
//             first_name: user.first_name,
//             last_name: user.last_name,
//             role: user.role,
//             token: token
//         })
//     }
//     else {
//         res.status(401)
//         throw new Error('Invalid credentials')
//     }
// })

// const logoutUser = asyncHandler(async(req, res) => {

//     const options = {
//         httpOnly: true,
//         secure: true
//     }

//     return res
//     .status(200)
//     .clearCookie("token", options)
//     .json(new ApiResponse(200, {}, "User logged Out"))
// })

// export {
//   registerUser,
//   loginUser,
//   logoutUser
// };


// import asyncHandler from "../utils/asyncHandler.js"
// import { 
//     registerUserService, 
//     loginUserService 
// } from "../services/auth.service.js"

import { generateToken } from "../services/token.service.js"



const registerUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        
        throw new ApiError(400,"Please add all the details")
    }

    const user = await registerUserService(req.body)
    const token = generateToken(user.id)

    // res.status(201).json({
    //     success: true,
    //     message: "User registered successfully",
    //     _id: user.id,
    //     email: user.email,
    //     first_name: user.first_name,
    //     last_name: user.last_name,
    //     role: user.role,
    //     token: generateToken(user.id)
    // })

    res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            {
                user: user, token,
            },
            "User registered successfully"
        )
    )

})


const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        
        throw new ApiError(400,"Please add all the details")
    }

    const user = await loginUserService(email, password)

    const token = generateToken(user.id)

    const options = {
        httpOnly: true,
        secure: true
    }

    // res
    // .status(200)
    // .cookie("token", token, options)
    // .json({
    //     success: true,
    //     message: "User logged in successfully",
    //     _id: user.id,
    //     email: user.email,
    //     first_name: user.first_name,
    //     last_name: user.last_name,
    //     role: user.role,
    //     token
    // })


    res
    .status(200)
    .cookie("token", token, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: user, token,
            },
            "User loged in successfully"
        )
    )

})


const logoutUser = asyncHandler(async(req, res) => {

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("token", options)
    // .json({
    //     success: true,
    //     message: "User logged out successfully"
    // })
    .json(
        new ApiResponse(200,{},"User logged out successfully")
    )

})


export {
  registerUser,
  loginUser,
  logoutUser
}
