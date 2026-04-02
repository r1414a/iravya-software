import bcrypt from "bcryptjs";
import sql from '../db/database.js'
import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import {registerUserService, 
    loginUserService, 
    deleteUserService,
    userExistbyemailService,
    userExistbyidService,
    resetPasswordService,
    setUserStatusService
}  from "../services/auth.service.js";
import { generateToken } from "../services/token.service.js"

const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body

    const userExists = await userExistbyemailService(email)
    if (userExists.length) {
        res.status(200)
        .json(
            new ApiResponse(
                200, 
                {
                    user: userExists[0],
                },
                "User already exist"
            )
        )
    }
    else{
    const user = await registerUserService(req.body)
    const token = generateToken(user.id, email, user.role)

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
                user: user,
            },
            "User registered successfully"
        )
    )}

})

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    const userExists = await userExistbyemailService(email)
    if (!userExists.length) {
        res.status(200)
        .json(
            new ApiResponse(
                200, 
                {
                    user: userExists[0],
                },
                "User does bot exist"
            )
        )
    }
    else{

        const user = await loginUserService(email, password)

        const token = generateToken(user.id)

        const options = {
            httpOnly: true,
            secure: true,
            maxAege: 24 *60*60*1000
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
                    user: user,
                },
                "User loged in successfully"
            )
        )
    }

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

const deleteUser = asyncHandler(async(req, res)=>{
    const { id } = req.params
    const userExists = await userExistbyidService(id)
    if (!userExists.length) {
        res.status(200)
        .json(
            new ApiResponse(
                404, 
                {
                    user: userExists[0],
                },
                "User does not exist"
            )
        )
    }
    else{
        const options = {
            httpOnly: true,
            secure: true
        }
        const user = await deleteUserService(id)
        res
        .clearCookie('token', options)
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User deleted successfully"
            )
        )
    }
})

const resetPassword = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    const { old_pass , new_pass} = req.body;
    const userExists = await userExistbyidService(id)
    if (!userExists.length) {
        res.status(200)
        .json(
            new ApiResponse(
                404, 
                {
                    user: userExists[0],
                },
                "User does not exist"
            )
        )
    }
    const user = userExists[0]
    const isMatch = await bcrypt.compare(old_pass, new_pass)

    if(old_pass === new_pass || isMatch){
        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Old and new password should not be same."
            )
        )
    }
    else{
        const user_ = await resetPasswordService(id, old_pass, new_pass)
        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    user_,
                    "New password reset successfully."
                )
            ) 
    }   
}) 

const setUserStatus = asyncHandler(async (req, res) => {
    const {id} = req.params
    const {status} = req.body
    const userExists = await userExistbyidService(id)
    if (!userExists.length) {
        res.status(200)
        .json(
            new ApiResponse(
                404, 
                {
                    user: userExists[0],
                },
                "User does not exist"
            )
        )
    }
    else{
        const updated_user = await setUserStatusService(id,status)
        res.status(200)
        .json(
            new ApiResponse(200, 
                updated_user,
                "User status changed sucessfully"
            )
        )
    }
    
})


export {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  resetPassword,
  setUserStatus
}
