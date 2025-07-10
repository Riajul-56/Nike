import { Category } from '../models/category.model.js';
import ApiError from '../utils/apiError.js';
import ApiSuccess from '../utils/apiSuccess.js';
import { asyncHandler } from '../utils/asynceHandler.js';
import { fileUpload } from '../utils/fileupload.js';
import { createImageSchema } from '../validators/category.validator.js';

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().populate('subCategories');
  if (categories.length === 0) {
    return res.status(200).json(ApiSuccess.ok('No categories fetched', categories));
  }
  return res.status(200).json(ApiSuccess.ok('Categories fetched', categories));
});

// =================================== Create Category ===============================================================//

const createCategory = asyncHandler(async (req, res) => {
  const image = req.file;
  const validateImage = createImageSchema.safeParse(image);
  if (validateImage.error) {
    throw ApiError.badRequest('Image is requried');
  }

  let { name, slug } = req.body;
  const isNameExists = await Category.findOne({ name });
  if (isNameExists) {
    throw ApiError.badRequest('Category name already esists');
  }

  const isSlugExists = await Category.findOne({ slug });
  if (isSlugExists) {
    throw ApiError.badRequest('Category slug already esists');
  }
  if (!slug) {
    slug = name.toLowerCase().replaceAll(' ', '-');
  }

  const result = await fileUpload(image.path, {
    folder: 'categories',
    use_filename: true,
    overwrite: true,
    resource_type: 'image',
    public_id: name,
  });
  const category = await Category.create({
    name,
    slug,
    image: {
      url: result.secure_url,
      public_id: result.public_id,
    },
  });
  return res.status(201).json(ApiSuccess.ok('Category created', category));
});

// =================================== Get Category ===============================================================//

const getCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
});

// =================================== Update Category ===============================================================//

// const updateCategory=asyncHandler(async(req,res)=>{

// })

export { getCategories, createCategory, getCategory };
