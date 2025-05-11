import mongoose from "mongoose"
import { MONGO_URL } from "../constants.js"
import ApiError from "../utils/apiError.js";

const dbConnection = async () => {
    try {
        await mongoose.connect(MONGO_URL)
        console.log("database connected ");

    } catch (error) {
        throw  ApiError.databaseError(error.message)
    }
}
export default dbConnection