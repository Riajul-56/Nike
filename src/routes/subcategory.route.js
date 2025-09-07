import e from 'express';
import auth from '../middlewares/auth.middleware.js';
import upload from '../middlewares/fileUpload.middleware.js';
import validationMiddleware from '../middlewares/validator.middleware.js';
import {
  createSubcategory,
  deleteSubCategory,
  getsubCategory,
  updateSubCategory,
} from '../controllers/subcategory.controller.js';
import { createSubcategorySchema, subCategoryImageSchema } from '../validators/subcategory.validator.js';

const router = e.Router();

router
  .route('/subcategories')
  .get(auth, getsubCategory)
  .post(
    auth,
    upload.single('image'),
    validationMiddleware(createSubcategorySchema),
    createSubcategory
  );

router
  .route('/subcategories/:slugParam')
  .get(auth, getsubCategory)
  .put(
    auth,
    upload.single('image'),
    validationMiddleware(subCategoryImageSchema),
    updateSubCategory
  )
  .delete(auth, deleteSubCategory);

export default router;
