import mongoose from "mongoose";
import databaseName from "../constant.js";

const connectDatabase = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}/${databaseName}`)
        console.log(`${connectionInstance.connection.host}/${databaseName}`)
    } catch (error) {
        console.error(error?.message)
        process.exit(1)
    }
}

export default connectDatabase