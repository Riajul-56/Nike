import e from "express"
import { sigin, signup, verifymail } from "../controllers/user/user.controller.js"
import validationMiddleware from "../middlewares/validator.middleware.js"
import { userSigninSchema, userSignupSchema } from "../validators/user.validator.js"

const router = e.Router()

router.post("/users/signup", validationMiddleware(userSignupSchema), signup)
router.get("/users/verify", verifymail)
router.post("/users/sigin", validationMiddleware(userSigninSchema), sigin)


export default router
