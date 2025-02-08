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

export default app