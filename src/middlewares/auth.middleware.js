import { ACCESS_TOKEN_SECRET } from '../constants.js';
import { User } from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import { asyncHandler } from '../utils/asynceHandler.js';
import jwt from 'jsonwebtoken';

const auth = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer', '');
  if (!token) {
    throw ApiError.unauthorized('Access token not found. Please log in.');
  }

  let decodeToken;
  try {
    decodeToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired access token.');
  }

  if (!decodeToken?.id) {
    throw ApiError.unauthorized('Token does not contain valid user info.');
  }
  const user = await User.findById(decodeToken.id).select(
    '-_v -password -createdAt -updatedAt -passwordResetToken -passwordResetExpires'
  );
  if (!user) {
    throw ApiError.unauthorized('User no longer exists.');
  }
  req.user = user;
  next();
});

export default auth;
