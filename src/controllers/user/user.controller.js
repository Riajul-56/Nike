import { APP_URL, JWT_SECRET } from "../../constants.js";
import { User } from "../../models/user.model.js";
import ApiError from "../../utils/apiError.js";
import ApiSuccess from "../../utils/apiSuccess.js";
import { asyncHandler } from "../../utils/asynceHandler.js";
import { sendMail, forgotPasswordFormat, verifyEmailFormat } from "../../utils/mail.js";
import jwt from "jsonwebtoken"


//============================================ Sign Up =======================================================================//

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

    const user = await User.findById(createdUser._id).select("-_v -password -createdAt -updatedAt -passwordResetToken -passwordResetExpires")

    const token = user.jwtToken()
    const verifyUrl = `${APP_URL}/api/v1/users/verify?token=${token}`
    sendMail({
        email,
        subject: "Verify you email",
        mailFormat: verifyEmailFormat(name, verifyUrl)
    })

    return res.status(200).json(ApiSuccess.created("User created", user))
})


//============================================ Email Verify =======================================================================//

const verifymail = asyncHandler(async (req, res) => {
    const { token } = req.query
    if (!token) {
        throw ApiError.badRequest("Token is required")
    }

    let decodeToken
    try {
        decodeToken = jwt.verify(token, JWT_SECRET)
    } catch (error) {
        throw ApiError.unauthorized("Invalid or expired access token.")
    }

    const user = await User.findById(decodeToken.id).select("-_v -password -createdAt -updatedAt -passwordResetToken -passwordResetExpires")
    if (!user) {
        throw ApiError.notFound("User not Found")
    }
    if (user.isVerified) {
        return res.status(200).json(ApiSuccess.ok("User already verified", user))
    } else {
        user.isVerified = true
        await user.save()
        return res.status(200).json(ApiSuccess.ok("User verified", user))
    }
})


//============================================ Sign In =======================================================================//

const sigin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
        throw ApiError.notFound("Invalid credentials")
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
        throw ApiError.notFound("Invalid Password")
    }

    const accessToken = user.accessToken()
    const refreshToken = user.refreshToken()
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    }

    return res
        .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
        .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })

        .status(200)
        .json(ApiSuccess.ok("User Signed in", { accessToken, refreshToken }))
})


//============================================ Sign Out =======================================================================//

const signout = asyncHandler(async (_req, res) => {
    return res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .status(200).
        json(ApiSuccess.ok("User signed out"))
})


//============================================ User Update =======================================================================//

const updateUser = asyncHandler(async (req, res) => {
    const { username, name, email } = req.body
    const user = await User.findById(req.user._id)
    if (!user) {
        throw ApiError.notFound('User not found')
    }



    if (user.username !== username) {
        const isUsernameExists = await User.findOne({ username })
        if (isUsernameExists) {
            throw ApiError.badRequest('Username already exists')
        } else {
            user.username = username
        }
    }



    if (user.email !== email) {
        const isEmailExists = await User.findOne({ email })
        if (isEmailExists) {
            throw ApiError.badRequest('Email already exists')
        } else {
            user.isVerified = false
            user.email = email
            const token = user.jwtToken()
            const verifyUrl = `${APP_URL}/api/v1/users/verify?token=${token}`
            sendMail({
                email,
                subject: "Verify you email",
                mailFormat: verifyEmail(name, verifyUrl)
            })
        }
    }


    user.name = name
    await user.save()
    return res.status(300).json(ApiSuccess.ok('User Updated', user))
})


//============================================ Update password =======================================================================//

const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = req.user
    if (oldPassword || newPassword) {
        throw ApiError.badRequest('New password can not be same as old password')
    }
    const isMatch = await user.comparePassword(oldPassword)
    if (!isMatch) {
        throw ApiError.notFound('Old password us incorrect')
    }
    user.password = newPassword
    await user.save()
    return res.status(200).json(ApiSuccess.ok('Password updated'))
})


//============================================ Forgot Password =======================================================================//

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        throw ApiError.notFound('User not found.')
    }
    const otp = Math.floor(1000 + Math.random() * 9000)
    sendMail({
        email,
        subject: 'reset password',
        mailFormat: forgotPasswordFormat(user.name, otp)
    })
    user.passwordResetToken = otp
    user.passwordResetExpires = Data.now() + 5 * 60 * 1000
    await user.save()
    return res.status(200).json(ApiSuccess.ok('OTP sent.'))
})


//============================================ Validate OTP =======================================================================//
const validateOpt = asyncHandler(async (req, res) => {
    const { otp } = req.body
    const user = await User.findOne({ passwordResetToken: otp })
    if (!user) {
        throw ApiError.notFound('Invalid otp')
    }
    if (user.passwordResetExpires < Data.now()) {
        throw ApiError.notFound('Otp expired')
    }
    user.passwordResetToken=null
    user.passwordResetExpires=null
    await user.save()
    return res.status(200).json(ApiSuccess.ok('Otp verified'))
})

export { signup, verifymail, sigin, signout, updateUser, updatePassword, forgotPassword, validateOpt }