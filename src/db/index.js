import mongoose from "mongoose"
import { MONGO_URL } from "../constants.js"
import ApiError from "../utils/apiError.js";

const MAX_RETRIES = 3
const RETRY_DELEY_MS = 1000

const dbConnection = async (attempt = 1) => {
    try {
        await mongoose.connect(MONGO_URL)
        console.log("Database Connected Successfully ");

    } catch (error) {
        if (attempt <= MAX_RETRIES) {
            const delay = RETRY_DELEY_MS * 2 ** (attempt - 1)
            return dbConnection(attempt = +1)
        }
        throw ApiError.databaseError(error.message)
    }
}
export default dbConnection