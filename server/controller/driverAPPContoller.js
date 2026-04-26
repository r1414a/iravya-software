import asyncHandler from "../utils/asyncHandler.js"
import  ApiError  from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sendResponse from "../utils/sendResponse.js";
import crypto from 'crypto';
import redisClient from '../config/redis.js'
import { sendPush } from "../services/notification.service.js";
import { userExistbyPhoneService } from "../services/auth.service.js";

import { getDriverTripsService,
    getCurrentTripService,
    confirmStopDeliveryService,
    acceptTripService,
    reportIssueService,
    confirmCompletionOfTripService
 } from "../services/driverAPP.service.js";


const getDriverTrips = asyncHandler(async (req, res) => {
    const {id} = req.params
    const trip_data = await getDriverTripsService(id)
    if(trip_data){sendResponse(res, 201, trip_data, "Found trip data")}
    else{
        sendResponse(res, 200, trip_data, "No data found")
    }
})

const getCurrentTrip =  asyncHandler(async (req, res) => {
    const {id} = req.params
    console.log(id)
    const trip = await getCurrentTripService(id)
    // console.log(trip)
    if(trip.length){
        sendResponse(res, 201, trip, "Current Trip")
    }
    else{
        sendResponse(res, 200, trip, "No current trip")
    }

})

const acceptTrip = asyncHandler(async (req, res) => {
    const {trip_id} = req.params

    const trip = await acceptTripService(trip_id)
    if(trip.length){
        sendResponse(res, 200, trip, "Accepted trip successfully")

    }
    else{
        throw new ApiError(404, "Trip not found")
    }

})

const confirmStopDelivery = asyncHandler(async (req, res) => {
   const {stop_id, trip_id} = req.params
   const stop_delivery = await confirmStopDeliveryService(stop_id, trip_id)
   if(stop_delivery.length){
        sendResponse(res, 200, stop_delivery, "Confirm delivery")
   }
   else{
        throw new ApiError(200, 'Not found trip')
   }
})

const reportIssue = asyncHandler(async (req, res) => {
    const {trip_id} = req.params
    const {issue_type, issue} = req.body

    const issue_data = await reportIssueService(trip_id, issue_type, issue)
    if(issue.length){
        sendResponse(res, 200, issue_data, "Reported issue successfully")
    }
    else{
        throw new ApiError(400, "Bad Request")
    }
})

const confirmCompletionOfTrip = asyncHandler (async (req, res) => {
    const {trip_id} = req.params
    const trip = await confirmCompletionOfTripService(trip_id)
    if(trip){
        sendResponse(res, 200, trip, "Trip completed")
    }
    else{
        sendResponse(400, "Bad Request")
    }
})

const requestOtp = asyncHandler(async (req, res) => {
    const { phoneNumber, deviceToken } = req.body;

    if (!phoneNumber || !deviceToken) {
        return res.status(400).json({ error: 'Missing credentials' });
    }

    const userExists = await userExistbyPhoneService(phoneNumber)
    if(userExists.length){
        const otp = crypto.randomInt(100000, 999999).toString();

        await redisClient.set(`otp:${phoneNumber}`, otp, { EX: 300 });

        // Send the notification
        await sendPush(
            deviceToken, 
            'Sign-in Code', 
            `Your OTP is ${otp}`, 
            { type: 'AUTH' }
        );
        sendResponse(res, 200,
            {'user_id':userExists.id, 
            'user_phone':userExists.phone_number, 
              'user_email'  :userExists.email},'OTP Sent')

    }
    else{
        throw new ApiError(400, "User not exist")
    }
})

const verifyOTP = asyncHandler(async (req, res) => {
    const { phoneNumber, otp } = req.body;
    const storedOtp = await redisClient.get(`otp:${phoneNumber}`);

    if (!storedOtp || storedOtp !== otp) {
        throw new ApiError(401, 'Invalid or expired OTP')
    }

    // Delete OTP after successful use
    await redisClient.del(`otp:${phoneNumber}`);
    sendResponse(res, 200, {phoneNumber}, 'Authenticated')
})

export{
    getDriverTrips,
    getCurrentTrip,
    confirmStopDelivery,
    acceptTrip,
    reportIssue,
    confirmCompletionOfTrip,
    verifyOTP,
    requestOtp

}