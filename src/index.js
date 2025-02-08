import app from "./app.js";
import connectDatabase from "./database/db.connect.js";
import dotenv from "dotenv"

dotenv.config()

connectDatabase()
.then(() => {
    console.log("Database connected successfully! ...")

    app.listen(process.env.PORT_NUMBER || 4000, () => {
        console.log(`Server is listining on port :: ${process.env.PORT_NUMBER || 4000}`)
        console.log(`Server_URI :: http://localhost:${process.env.PORT_NUMBER || 4000}`)
    })
})
.catch((error) => {
    console.error(error?.message)
    process.exit(1)
})