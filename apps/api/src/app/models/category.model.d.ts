import { Document, Model } from 'mongoose';

interface CategoryDocument extends Document {
  name: string;
  color: string;
}

const Category: Model<CategoryDocument>;

export const CATEGORY_SCHEMA_KEY: string;
export default Category;
