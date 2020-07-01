import mongoose, { Schema } from 'mongoose';
import uniqueValidatorPlugin from 'mongoose-unique-validator';

export const CATEGORY_SCHEMA_KEY = 'Category';

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      unique: true,
      trim: true,
      minlength: [5, 'El nombre debe tener al menos cinco caracteres'],
      maxlength: [9, 'El nombre debe tener no más de nueve caracteres'],
    },
    color: {
      type: String,
      required: [true, 'El color es requerido'],
      trim: true,
      lowercase: true,
      minlength: [4, 'El color debe tener al menos cuatro caracteres'],
      maxlength: [9, 'El color debe tener no más de nueve caracteres'],
      match: /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9-a-f]{8})$/i,
    },
  },
  { timestamps: true },
);

CategorySchema.plugin(uniqueValidatorPlugin, {
  message: ({ value }) => `La categoría cuyo nombre es "${value}" ya existe`,
});

const Category = mongoose.model(CATEGORY_SCHEMA_KEY, CategorySchema);

export default Category;
