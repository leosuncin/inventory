import mongoose, { Schema, Types } from 'mongoose';
import idValidatorPlugin from 'mongoose-id-validator';
import paginatePlugin from 'mongoose-paginate-v2';

import { CATEGORY_SCHEMA_KEY } from './category.model';
import { PRODUCT_SCHEMA_KEY } from './product.model';

export const INVENTORY_SCHEMA_KEY = 'Inventory';

const InventorySchema = new Schema(
  {
    product: {
      type: Types.ObjectId,
      ref: PRODUCT_SCHEMA_KEY,
      required: [true, 'El producto es requerido'],
      index: true,
    },
    category: {
      type: Types.ObjectId,
      ref: CATEGORY_SCHEMA_KEY,
      required: [true, 'La categoría es requerida'],
      index: true,
    },
    quantityOrder: {
      type: Number,
      required: [true, 'La cantidad de unidades es requerida'],
      min: [0, 'La cantidad de unidades debe ser un numero entero positivo'],
      default: 0,
    },
    unitCost: {
      type: Number,
      required: [true, 'El costo unitario es requerido'],
      min: [0, 'El costo unitario debe ser un numero positivo mayor que cero'],
      default: 1,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true },
);

InventorySchema.plugin(idValidatorPlugin, {
  message: ({ path, value }) =>
    `${
      path === 'category' ? 'La categoría' : 'El producto'
    } con id: "${value}" no existe`,
});
InventorySchema.plugin(paginatePlugin);

const Inventory = mongoose.model(INVENTORY_SCHEMA_KEY, InventorySchema);

export default Inventory;
