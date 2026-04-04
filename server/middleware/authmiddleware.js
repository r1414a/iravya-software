// const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken"
// const asyncHandler = require('express-async-handler');
import asyncHandler from "../utils/asyncHandler.js"
import sql from "../db/database.js"// your postgres connection
import ApiError from "../utils/ApiError.js";

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies['token'];

  if (!token) {
    throw new ApiError(401, "Not Authorized")
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

});

export { protect };