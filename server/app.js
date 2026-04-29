import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import  {createProxyMiddleware} from 'http-proxy-middleware'
import userRoutes from './routes/userRoutes.js'
import { globalErrorHandler } from "./middleware/globalErrorHandler.js"
import dcRoutes from './routes/dcRoutes.js'
import driverRoutes from './routes/driverRoutes.js'
import truckRoutes from './routes/truckRoutes.js'
import storeRoutes from "./routes/storeRoutes.js"
import brandRoutes from "./routes/brandRoutes.js"
import settingsRoutes from "./routes/settingsRoutes.js"
import tripRoutes from "./routes/tripRoutes.js"
import driverAPPRoutes from "./routes/driverAPPRoutes.js"
import reportIssuesRoutes from "./routes/reportIssuesRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js"

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
app.use('/api/v1/drivers',driverRoutes)
app.use('/api/v1/trucks',truckRoutes)
app.use('/api/v1/stores',storeRoutes)
app.use('/api/v1/brands',brandRoutes)
app.use('/api/v1/trips',tripRoutes)
app.use('/api/v1/settings', settingsRoutes)
app.use('/api/v1/driverapp',driverAPPRoutes)
app.use('/api/v1/issues',reportIssuesRoutes)
app.use('/api/v1/analytics',analyticsRoutes)

app.use(globalErrorHandler);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

export default app;
