import e from "express"
import { forgotPassword, sigin, signout, signup, updatePassword, updateUser, verifymail } from "../controllers/user/user.controller.js"
import validationMiddleware from "../middlewares/validator.middleware.js"
import { userPasswordUpdateSchema, userSigninSchema, userSignupSchema, userUpdateSchema } from "../validators/user.validator.js"
import auth from "../middlewares/auth.middleware.js"

const router = e.Router()

router.post("/signup", validationMiddleware(userSignupSchema), signup)
router.get("/verify", verifymail)
router.post("/sigin", validationMiddleware(userSigninSchema), sigin)
router.get("/signout", auth, signout)
router.post("/update", auth, validationMiddleware(userUpdateSchema), updateUser)
router.post("/update-password", auth, validationMiddleware(userPasswordUpdateSchema), updatePassword)
router.post("/forgot-password", validationMiddleware(userPasswordUpdateSchema), forgotPassword)


export default router
