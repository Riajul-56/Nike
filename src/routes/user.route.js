import e from "express"
import { sigin, signout, signup, verifymail } from "../controllers/user/user.controller.js"
import validationMiddleware from "../middlewares/validator.middleware.js"
import { userSigninSchema, userSignupSchema } from "../validators/user.validator.js"
import auth from "../middlewares/auth.middleware.js"

const router = e.Router()

router.post("/users/signup", validationMiddleware(userSignupSchema), signup)
router.get("/users/verify", verifymail)
router.post("/users/sigin", validationMiddleware(userSigninSchema), sigin)
router.get("/signout",auth,signout)


export default router
