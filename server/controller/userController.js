import bcrypt from "bcryptjs";
import sql from '../db/database.js'
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js";
import crypto from 'crypto';
import redisClient from '../config/redis.js'
import { sendPush } from "../services/notification.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
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
    setUserPasswordService,
    buildUserResponse,
    userExistbyPhoneService
} from "../services/auth.service.js";
import { generateToken } from "../services/token.service.js"
import sendResponse from "../utils/sendResponse.js";

const getMe = asyncHandler(async (req, res) => {
    const responseData = await buildUserResponse(req.user)
    sendResponse(res, 200, responseData, "")
})

const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body

    const userExists = await userExistbyemailService(email)
    if (userExists.length) {
        throw new ApiError(200, "Email already in use");

    }
    else {
        const user = await registerUserService(req.body)
        const token = generateToken(user.id, email, user.role)



        sendResponse(res, 201, user, "User registered successfully");


    }

})

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    const userExists = await userExistbyemailService(email)
    if (!userExists.length) {
        throw new ApiError(401, "We couldn't find that account.")
    }

    const user = await loginUserService(email, password)

    let responseData = await buildUserResponse(user)

    const token = generateToken(user.id)

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: "/",
        maxAge: 24 * 60 * 60 * 1000
    }

    res.cookie("token", token, options)

    // console.log("responseData",responseData);
    
    sendResponse(res, 200, responseData, `Welcome back, ${responseData.first_name} - (${responseData.role === 'super_admin' ? 'Super admin' : 'DC manager'})`)

})

const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
    });

    sendResponse(res, 200, {}, "User logged out successfully");
});

const deleteUser = asyncHandler(async (req, res) => {
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
    else {
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/",
        }
        const user = await deleteUserService(id)
        if (req.user.id === id) {
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
        } else {
            sendResponse(res, 200, user, "User deleted successfully")
        }

    }
})

const resetPassword = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { old_pass, new_pass } = req.body;
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

    if (old_pass === new_pass || isMatch) {
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
    else {
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

const setUserPassword = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await setUserPasswordService(req.body, id);



    if (user) {
        sendResponse(res, 200, user, "Password reset successfully");
    } else {
        throw new ApiError(404, "User not found");
    }
});

const setUserStatus = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { status } = req.body
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
    else {
        const updated_user = await setUserStatusService(id, status)
        res.status(200)
            .json(
                new ApiResponse(200,
                    updated_user,
                    "User status changed sucessfully"
                )
            )
    }

})

const getAllUser = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const { role = null, status = null } = req.query
    const { search = null } = req.query
    const users = await getUserbySearchService(page, limit, search, role, status)
    res.status(201)
        .json(new ApiResponse(
            201,
            users,
            "All users fetch successfully."
        ))
})

const getUserbySearch = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const { role = null, status = null } = req.query
    const { search = null } = req.query
    const users = await getUserbySearchService(page, limit, search, role, status)
    res.status(201)
        .json(new ApiResponse(
            201,
            users,
            "User found"
        ))
})

const getUserID = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = await userExistbyidService(id)
    if (user.length) {
        res.status(201)
            .json(
                new ApiResponse(201,
                    user,
                    "Found User"
                )
            )
    } else {
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
    const { id } = req.params
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
    } else {
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
    getUserbySearch,
    setUserPassword
}
