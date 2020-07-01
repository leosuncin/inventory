import Category from '../models/category.model';

/**
 * Create a new category
 *
 * @param {object} newCategory The new category
 * @param {string} newCategory.name
 * @param {string} newCategory.color
 * @returns Promise<CategoryDocument> Saved category
 */
export async function createCategory(newCategory) {
  const category = new Category(newCategory);

  return category.save();
}

/**
 * List all categories
 *
 * @returns Promise<CategoryDocument[]> Array of categories
 */
export async function listCategory() {
  return Category.find().exec();
}

/**
 * Get one category by id
 *
 * @param {string} id Category identifier
 * @returns Promise<CategoryDocument|null> One category
 */
export async function getOneCategory(id) {
  return Category.findById(id).exec();
}
