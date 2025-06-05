import { z } from "zod"

const userSignupSchema = z.object({
    username: z
        .string()
        .min(3),
    name: z
        .string()
        .min(3),
    email: z
        .string()
        .email(),
    password: z
        .string()
        .regex(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            "Password must contain at least one lowercase letter,one uppercase letter,one number and at least 8 chacaters long "
        ),
})

const userSigninSchema = z.object({
    email: z.string(),
    password: z.string()
})

const userUpdateSchema = z.object({
    username: z.string().min(3),
    name: z.string().min(3),
    email: z.string().email(),
})

const userPasswordUpdateSchema = z.object({
    password: z
        .string()
        .regex(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            "Password must contain at least one lowercase letter,one uppercase letter,one number and at least 8 chacaters long "
        ),
})

const userForgotPasswordSchema = z.object({
    email: z
        .string()
        .email(),
})

const userForgotPasswordOtpSchema = z.object({
    otp: z.string(),
})

export { userSignupSchema, userSigninSchema, userUpdateSchema, userPasswordUpdateSchema, userForgotPasswordSchema, userForgotPasswordOtpSchema }