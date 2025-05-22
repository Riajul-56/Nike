import { APP_URL } from "../../constants.js";
import { User } from "../../models/user.model.js";
import ApiError from "../../utils/apiError.js";
import ApiSuccess from "../../utils/apiSuccess.js";
import { asyncHandler } from "../../utils/asynceHandler.js";
import { sendMail, verifyEmail } from "../../utils/mail.js";

const signup = asyncHandler(async (req, res) => {
    const { username, name, email, password } = req.body
    const usernameExists = await User.findOne({ username })
    if (usernameExists) {
        throw ApiError.badRequest("Username already exists")
    }
    const emailExists = await User.findOne({ email })
    if (emailExists) {
        throw ApiError.badRequest("Email already exists")
    }
    const createdUser = await User.create({ username, name, email, password })


    const user = await User.findById(createdUser._id).select("-password -createdAt -updatedAt -passwordResetToken -passwordResetExpires")

    const token = user.jwtToken()
    const verifyUrl = `${APP_URL}/api/v1/users/verify/?token=${token}`
    sendMail({
        email,
        subject: "Verify you email",
        mailFormat: verifyEmail(name, verifyUrl)
    })

    return res.status(200).json(ApiSuccess.created("User created", user))
})
export { signup }