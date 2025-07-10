import e from 'express';
import { createCategory, getCategories } from '../controllers/category.controller.js';
import auth from '../middlewares/auth.middleware.js';
import upload from '../middlewares/fileUpload.middleware.js';
import { createCategorySchema } from '../validators/category.validator.js';
import validationMiddleware from '../middlewares/validator.middleware.js';

const router = e.Router();
router
  .route('/categories')
  .get(auth, getCategories)
  .post(auth, upload.single('image'), validationMiddleware(createCategorySchema), createCategory);

export default router;
