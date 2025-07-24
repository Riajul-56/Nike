import { NODE_ENV } from '../constants.js';

const errorHandler = (err, _req, res, _next) => {
  const { statusCode, message, errors, errorCode, stack } = err;

  return res.status(statusCode || 500).json({
    success: false,
    statusCode: statusCode || 500,
    message,
    errors,
    errorCode,
    ...(NODE_ENV === 'development' && { stack }),
  });
};
export default errorHandler;
