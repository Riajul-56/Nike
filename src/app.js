import express from 'express'
import cors from 'cors'
import { WHITELIST } from './constants.js'
import cookieParser from 'cookie-parser'
import errorHandler from './middlewares/errorHandler.middleware.js'


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use(cors({
    origin: WHITELIST,
    credentials: true,
}))

app.use(cookieParser())

//define routes
import healthCheckRoute from "./routes/healthCheck.route.js"
app.use(healthCheckRoute)

app.use(errorHandler)
export { app };
