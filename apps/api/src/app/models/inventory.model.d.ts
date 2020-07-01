import { Document, PaginateModel } from 'mongoose';

import Category from './category.model';
import Product from './product.model';

interface InventoryDocument extends Document {
  product: Product;
  category: Category;
  quantityOrder: number;
  unitCost: number;
}

const Inventory: PaginateModel<InventoryDocument>;

export const INVENTORY_SCHEMA_KEY: string;
export default Inventory;
