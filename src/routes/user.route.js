import e from "express"
import { sigin, signout, signup, updatePassword, updateUser, verifymail } from "../controllers/user/user.controller.js"
import validationMiddleware from "../middlewares/validator.middleware.js"
import { userPasswordUpdateSchema, userSigninSchema, userSignupSchema, userUpdateSchema } from "../validators/user.validator.js"
import auth from "../middlewares/auth.middleware.js"

const router = e.Router()

router.post("/signup", validationMiddleware(userSignupSchema), signup)
router.get("/verify", verifymail)
router.post("/sigin", validationMiddleware(userSigninSchema), sigin)
router.get("/signout", auth, signout)
router.get("/update", auth, validationMiddleware(userUpdateSchema), updateUser)
router.get("/update_password", auth, validationMiddleware(userPasswordUpdateSchema), updatePassword)


export default router
