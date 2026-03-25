
import express from "express";
import cors from "cors";

import dotenv from "dotenv";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5000;



// Load env
dotenv.config();

// App init
const app = express();


// ===============================
// Middleware
// ===============================
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());



// ===============================
// Health Check
// ===============================
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});