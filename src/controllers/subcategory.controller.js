import { SubCategory } from '../models/index.model.js';
import ApiSuccess from '../utils/apiSuccess';

const getSubcategories = async (req, res) => {
  const subcategories = await SubCategory.find();
  if (subcategories.length === 0) {
    return res.status(200).json(ApiSuccess.ok('No subcategories found', subcategories));
  }
  return res.status(200).json(ApiSuccess.ok('Subcategories fatched', subcategories));
};

export { getSubcategories };
