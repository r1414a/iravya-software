const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const sql = require('../config/db'); // your postgres connection

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // PostgreSQL Query instead of User.findById
      const users = await sql`
        SELECT id, fisrt_name, last_name, last_login, status,  email, created_at, role,updated_at 
        FROM users 
        WHERE id = ${decoded.id}
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

module.exports = { protect };