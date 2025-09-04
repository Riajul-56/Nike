import { Subcategory } from '../models/subCategory.model.js';
import ApiSuccess from '../utils/apiSuccess';

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
  const validateImage = createImageSchema.safeParse(image);
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
    overwrite: true,
    resource_type: 'image',
    public_id: name,
  });
  const subcategory = await Subcategory.create({
    name,
    slug,
    image: {
      url: result.secure_url,
      public_id: result.public_id,
    },
    createdBy: req.user._id,
  });
  return res.status(201).json(ApiSuccess.ok('Subcategory created', subcategory));
});

// =================================== Get Category ===============================================================//

const getCategory = asyncHandler(async (req, res) => {
  const { slugParam } = req.params;
  const category = await Category.findOne({ slug: slugParam }).populate({
    path: 'subCategories',
    model: 'SubCategory',
  });
  if (!category) {
    throw ApiError.notFound('Category not found');
  }
  return res.status(200).json(ApiSuccess.ok('Category fetch', category));
});

// =================================== Update Category ===============================================================//

const updateCategory = asyncHandler(async (req, res) => {
  const { slugParam } = req.params;
  const { name, slug } = req.body;

  const category = await Category.findOne({
    $and: [{ slug: slugParam }, { createdBy: req.user._id }],
  });
  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  const isNameExists = await Category.findOne({ _id: { $ne: category._id }, name });
  if (isNameExists) {
    throw ApiError.badRequest('Category name already esists');
  }

  const isSlugExists = await Category.findOne({ _id: { $ne: category._id }, slug });
  if (isSlugExists) {
    throw ApiError.badRequest('0 slug already esists');
  }
  if (!slug) {
    slug = name.toLowerCase().replaceAll(' ', '-');
  }

  const image = req.file;
  if (image) {
    const result = await fileUpload(image.path, {
      folder: 'categories',
      use_filename: true,
      overwrite: true,
      resource_type: 'image',
      public_id: name,
    });
    category.image = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  category.name = name;
  category.slug = slug;
  await category.save();
  return res.status(200).json(ApiSuccess.ok('Category updated', category));
});

// =================================== Delete Category ===============================================================//

const deleteCategory = asyncHandler(async (req, res) => {
  const { slugParam } = req.params;
  const category = await Category.findOneAndDelete({
    $and: [{ slug: slugParam }, { createdBy: req.user._id }],
  });
  if (!category) {
    throw ApiError.notFound('Category not found');
  }
  return res.status(200).json(ApiSuccess.noContent('Category deleted'));
});

export { getSubcategories };
