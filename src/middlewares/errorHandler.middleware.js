import ApiError from "../utils/apiError.js"

const errorHandler = (err, _req, res, _next) => {
    const { statusCode, message, errors, errorCode, stack } = err;
    return res.status(statusCode || 500).json(ApiError.custom(statusCode, message, errors, stack, errorCode))
}
export default errorHandler;