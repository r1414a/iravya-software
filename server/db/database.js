// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   ssl: process.env.DB_SSL === "true"
//     ? { rejectUnauthorized: false }
//     : false,

//   max: 20, // max connections
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
// });

// pool.on("connect", () => {
//   console.log("Connected to PostgreSQL");
// });

// pool.on("error", (err) => {
//   console.error("Unexpected DB error", err);
//   process.exit(-1);
// });

// module.exports = pool;

import postgres from 'postgres'
import dotenv from "dotenv"
dotenv.config();  

const connectionString = process.env.DATABASE_URL
console.log(connectionString)
const sql = postgres(connectionString)

export default sql