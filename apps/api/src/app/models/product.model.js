import mongoose, { Schema, Types } from 'mongoose';
import idValidatorPlugin from 'mongoose-id-validator';
import paginatePlugin from 'mongoose-paginate-v2';

import { CATEGORY_SCHEMA_KEY } from './category.model';

export const PRODUCT_SCHEMA_KEY = 'Product';

const ProductSchema = new Schema(
  {
    category: {
      type: Types.ObjectId,
      ref: CATEGORY_SCHEMA_KEY,
      required: [true, 'La categoría es requerida'],
      index: true,
    },
    quantityStock: {
      type: Number,
      required: [true, 'La cantidad en existencia es requerida'],
      min: [0, 'La cantidad en existencia debe ser un numero entero positivo'],
      default: 0,
    },
    name: {
      type: String,
      required: [true, 'El nombre del producto es requerido'],
      index: true,
    },
    averageUnitCost: {
      type: Number,
      default: 1,
      required: [true, 'El costo unitario promedio es requerido'],
      min: [
        0,
        'El costo unitario promedio debe ser un numero positivo mayor que cero',
      ],
    },
    currentSalePrice: {
      type: Number,
      default: 1,
      required: [true, 'El precio de venta actual es requerido'],
      min: [
        0,
        'El precio de venta actual debe ser un numero positivo mayor que cero',
      ],
    },
  },
  { toJSON: { virtuals: true }, timestamps: true },
);

ProductSchema.virtual('color').get(function () {
  if (this.quantityStock < 100) return '#f00';
  if (this.quantityStock >= 100 && this.quantityStock < 200) return '#ffa500';
});

ProductSchema.plugin(idValidatorPlugin, {
  message: ({ value }) => `La categoría con id: "${value}" no existe`,
});
ProductSchema.plugin(paginatePlugin);

const Product = mongoose.model(PRODUCT_SCHEMA_KEY, ProductSchema);

export default Product;
