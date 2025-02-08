import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: [ "GET", "POST", "PUT", "PATCH", "DELETE" ] 
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


import userRoute from "./routes/user.route.js"

app.use("/api/v1/user", userRoute)



export default app