import ApiError from "../utils/apiError.js"


const errorHandler = (err, _, res) => {
    return res.json(ApiError.serverError(err.message, err.errors, err.errorCode))
}
export default errorHandler;