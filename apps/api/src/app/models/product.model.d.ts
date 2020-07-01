import { Document, PaginateModel } from 'mongoose';

import Category from './category.model';

interface ProductDocument extends Document {
  category: Category;
  quantityStock: number;
  name: string;
  averageUnitCost: number;
  currentSalePrice: number;
}

const Product: PaginateModel<ProductDocument>;

export const PRODUCT_SCHEMA_KEY: string;
export default Product;
