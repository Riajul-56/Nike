import ApiError from "../utils/apiError.js"


const errorHandler = (err) => {
    throw ApiError.serverError(err.message, err.errors, err.errorCode);
}
export default errorHandler;