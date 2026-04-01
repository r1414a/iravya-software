// const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken"
// const asyncHandler = require('express-async-handler');
import asyncHandler from "../utils/asyncHandler.js"
import sql from "../db/database.js"// your postgres connection
import  ApiError  from "../utils/ApiError.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.cookies['token'];

      if (!token){
        throw new ApiError(401,"token not found")
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // PostgreSQL Query instead of User.findById
      const users = await sql`
        SELECT "id", "first_name", "last_name", "last_login", "status",  "email", "created_at", "role","updated_at" 
        FROM "User" 
        WHERE "id" = ${decoded.id}
      `;

      if (!users.length) {
        res.status(401);
        throw new Error('User not found');
      }

      req.user = users[0];

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { protect };