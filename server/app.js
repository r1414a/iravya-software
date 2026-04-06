import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import  {createProxyMiddleware} from 'http-proxy-middleware'
import userRoutes from './routes/userRoutes.js'
import { globalErrorHandler } from "./middleware/globalErrorHandler.js"
import dcRoutes from './routes/dcRoutes.js'
import driverRoutes from './routes/driverRoutes.js'
import truckRoutes from './routes/truckRoutes.js'

const app = express()

app.use(cors({
    origin: process.env.CLIENT_DEV_URL,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())





app.use('/api/v1/users',userRoutes)
app.use('/api/v1/dc',dcRoutes)
app.use('/api/v1/driver',driverRoutes)

app.use(globalErrorHandler);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

export { app }