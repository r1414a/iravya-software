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
    setUserStatusService,
    getAllUserService,
    updateUserService,
    getUserbySearchService
}  from "../services/auth.service.js";
import { generateToken } from "../services/token.service.js"
import sendResponse from "../utils/sendResponse.js";

const getMe = asyncHandler(async (req,res) => {
    sendResponse(res, 200, req.user, "")
})

const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body

    const userExists = await userExistbyemailService(email)
    if (userExists.length) {
        throw new ApiError(200, "Email already in use");
        // res.status(200)
        // .json(
        //     new ApiResponse(
        //         200, 
        //         {
        //             user: userExists[0],
        //         },
        //         "User already exist"
        //     )
        // )
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


    sendResponse(res,201, user, "User registered successfully");
    // res
    // .status(200)
    // .json(
    //     new ApiResponse(
    //         200, 
    //         {
    //             user: user,
    //         },
    //         "User registered successfully"
    //     )
    // )

}

})

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    const userExists = await userExistbyemailService(email)
    if (!userExists.length) {
        throw new ApiError(401, "We couldn't find that account.")
        // res.status(200)
        // .json(
        //     new ApiResponse(
        //         200, 
        //         {
        //             user: userExists[0],
        //         },
        //         "We couldn't find that account."
        //     )
        // )
    }
    else{

        const user = await loginUserService(email, password)

        const token = generateToken(user.id)

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAege: 24 *60*60*1000
        }

       res.cookie("token", token, options)


        sendResponse(res, 200, user, `Welcome back, ${user.first_name} - (${user.role === 'super_admin' ? 'Super admin' : 'DC manager'})`)
        // res
        // .status(200)
        // .cookie("token", token, options)
        // .json(
        //     new ApiResponse(
        //         200, 
        //         {
        //             user: user,
        //         },
        //         "User loged in successfully"
        //     )
        // )
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

const getAllUser = asyncHandler(async(req, res)=>{
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const users = await getAllUserService(page, limit)
    res.status(201)
    .json(new ApiResponse(
        201,
        users,
        "All users fetch successfully."
    ))
})

const getUserbySearch = asyncHandler(async (req,res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const {role= null, status = null} = req.query
    const {slug} = req.body
    const users = await getUserbySearchService(page, limit, slug, role, status)
    res.status(201)
    .json(new ApiResponse(
        201,
        users,
        "User found"
    ))
})

const getUserID = asyncHandler(async(req, res)=>{
    const {id} = req.params
    const user = await userExistbyidService(id)
    if(user.length){
        res.status(201)
        .json(
            new ApiResponse(201, 
                user,
                "Found User"
            )
        )
    }else{
        res.status(201)
        .json(
            new ApiResponse(404, 
                {},
                "User does not exist"
            )
        )
    }
})

const updateUser = asyncHandler(async (req, res) => {
    const {id} = req.params
    console.log(req.body)
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
    }else{
        const user = await updateUserService(id, req.body)
        res.status(200).json(
            new ApiResponse(
                200,
                user,
                "User data is updated successfully"
            )
        );
    }
    
})


export {
    getMe,
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  resetPassword,
  setUserStatus,
  getAllUser,
  getUserID,
  updateUser,
  getUserbySearch
}
