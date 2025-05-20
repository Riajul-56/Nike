import { ZodError } from "zod"
import ApiError from "../utils/apiError.js"

function validationMiddleware(schema) {
    return async (req, res, next) => {
        try {
            const validdatedata = schema.parse(req.body)
            req.body = validdatedata
            next()
        } catch (error) {
            if (error instanceof ZodError) {
                const formatedErrors = error.errors.map(err => ({
                    field: err.path[0],
                    message: err.message
                }))

                throw ApiError.badRequest("Validation error", formatedErrors)
            }else{
                throw ApiError.serverError(error.message)
            }
        }
    }
}
export default validationMiddleware