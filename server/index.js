
import dotenv from "dotenv"
// import connectDB from "./db/index.js";
import app from './app.js'
import sql from "./db/database.js";
dotenv.config({
    path: './.env'
})

const PORT = process.env.PORT || 5000;



// Load env
// dotenv.config();







dotenv.config({
  path: "./.env",
});



async function startServer() {
  try {
    await sql`SELECT 1`;
    console.log("✅ Database Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error);
    process.exit(1);
  }
}

startServer();

