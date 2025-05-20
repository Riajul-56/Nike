import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asynceHandler.js";

const signup = asyncHandler(async (req, res) => {
    const {username,name,email,password}=req.body
})
export { signup }