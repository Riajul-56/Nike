import { v2 as cloudinary } from 'cloudinary';
import { CLOUD_API_KEY, CLOUD_API_SECRET, CLOUD_NAME } from '../constants.js';
import ApiError from './apiError.js';
import { existsSync, unlinkSync } from 'fs';

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

// Upload an image
const fileUpload = async (file, options) => {
  try {
    const result = await cloudinary.uploader.upload(file, { ...options });
    if (existsSync(file)) unlinkSync(file);
    return result;
  } catch (error) {
    if (existsSync(file)) unlinkSync(file);
    throw ApiError.serverError(error.message);
  }
};
export { fileUpload };
