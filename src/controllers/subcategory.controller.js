import { Subcategory } from '../models/subCategory.model.js';
import ApiError from '../utils/apiError.js';
import ApiSuccess from '../utils/apiSuccess.js';
import { asyncHandler } from '../utils/asynceHandler.js';
import { fileUpload } from '../utils/fileupload.js';
import { subCategoryImageSchema } from '../validators/subcategory.validator.js';

const getSubcategories = asyncHandler(async (req, res) => {
  const subcategories = await Subcategory.find({
    $or: [{ createdBy: req.user._id }, { createdBy: null }],
  });
  if (subcategories.length === 0) {
    return res.status(200).json(ApiSuccess.ok('No subcategories fetched', subcategories));
  }
  return res.status(200).json(ApiSuccess.ok('SubCategories fetched', subcategories));
});

// =================================== Create SubCategory ===============================================================//

const createSubcategory = asyncHandler(async (req, res) => {
  const image = req.file;
  const validateImage = subCategoryImageSchema.safeParse(image);
  if (validateImage.error) {
    throw ApiError.badRequest('Image is requried');
  }

  let { name, slug, category } = req.body;
  const isNameExists = await Subcategory.findOne({ name });
  if (isNameExists) {
    throw ApiError.badRequest('Subcategory name already esists');
  }

  const isSlugExists = await Subcategory.findOne({ slug });
  if (isSlugExists) {
    throw ApiError.badRequest('Subcategory slug already esists');
  }
  if (!slug) {
    slug = name.toLowerCase().replaceAll(' ', '-');
  }

  const result = await fileUpload(image.path, {
    folder: 'subcategories',
    use_filename: true,
    resource_type: 'image',
    overwrite: true,
    public_id: name,
  });
  const subcategory = await Subcategory.create({
    name,
    slug,
    image: {
      url: result.secure_url,
      public_id: result.public_id,
    },
    category,
    createdBy: req.user._id,
  });
  return res.status(201).json(ApiSuccess.ok('Subcategory created', subcategory));
});

// =================================== Get SubCategory ===============================================================//

const getsubCategory = asyncHandler(async (req, res) => {
  const { slugParam } = req.params;
  const subcategory = await Subcategory.find({ slug: slugParam });
  if (!subcategory) {
    throw ApiError.notFound('Subcategory not found');
  }
  return res.status(200).json(ApiSuccess.ok('Subcategory fetch', subcategory));
});

// =================================== Update Category ===============================================================//

const updateSubCategory = asyncHandler(async (req, res) => {
  const { slugParam } = req.params;
  let { name, slug, category } = req.body;

  const subcategory = await Subcategory.findOne({
    $and: [{ slug: slugParam }, { createdBy: req.user._id }],
  });
  if (!subcategory) {
    throw ApiError.notFound('Subcategory not found');
  }

  const isNameExists = await Subcategory.findOne({ _id: { $ne: subcategory._id }, name });
  if (isNameExists) {
    throw ApiError.badRequest('Subcategory name already esists');
  }

  const isSlugExists = await Subcategory.findOne({ _id: { $ne: subcategory._id }, slug });
  if (isSlugExists) {
    throw ApiError.badRequest('Subcategory slug already esists');
  }
  if (!slug) {
    slug = name.toLowerCase().replaceAll(' ', '-');
  }

  const image = req.file;
  if (image) {
    const result = await fileUpload(image.path, {
      folder: 'subcategories',
      use_filename: true,
      resource_type: 'image',
      overwrite: true,
      public_id: name,
    });
    subcategory.image = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  subcategory.name = name;
  subcategory.slug = slug;
  subcategory.category = category;
  await subcategory.save();
  return res.status(200).json(ApiSuccess.ok('Subcategory updated', subcategory));
});

// =================================== Delete SubCategory ===============================================================//

const deleteSubCategory = asyncHandler(async (req, res) => {
  const { slugParam } = req.params;
  const subcategory = await Subcategory.findOneAndDelete({
    $and: [{ slug: slugParam }, { createdBy: req.user._id }],
  });
  if (!subcategory) {
    throw ApiError.notFound('Subcategory not found');
  }
  return res.status(204).json(ApiSuccess.noContent('Subcategory deleted'));
});

export {
  getSubcategories,
  createSubcategory,
  getsubCategory,
  updateSubCategory,
  deleteSubCategory,
};
