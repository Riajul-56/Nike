import { ACCESS_TOKEN_SECRET } from "../constants.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asynceHandler.js";
import jwt from "jsonwebtoken"


const auth = asyncHandler(async (req, res, next) => {

    const token = req.cookies.accessToken || res.header("Authorization").replace("Bearer ", " ")
    if (!token) {
        throw ApiError.unauthorized("You are not logged in")
    }

    const decodeToken = jwt.verify(token, ACCESS_TOKEN_SECRET)
    if (!decodeToken) {
        throw ApiError.unauthorized("You are not logged in")
    }

    const user = await User.findById(decodeToken.id)
    if (!user) {
        throw ApiError.unauthorized("You are not logged in")
    }
    req.user = user
    next()

})
export default auth