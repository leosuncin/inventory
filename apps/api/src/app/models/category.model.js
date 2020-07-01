import mongoose, { Schema } from 'mongoose';
import uniqueValidatorPlugin from 'mongoose-unique-validator';

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      minlength: [5, 'El nombre debe tener al menos cinco caracteres'],
      maxlength: [9, 'El nombre debe tener no más de nueve caracteres'],
    },
    color: {
      type: String,
      required: [true, 'El color es requerido'],
      trim: true,
      lowercase: true,
      minlength: [4, 'El nombre debe tener al menos cuatro caracteres'],
      maxlength: [9, 'El nombre debe tener no más de nueve caracteres'],
    },
  },
  { timestamps: true },
);

CategorySchema.plugin(uniqueValidatorPlugin, {
  message: 'La categoría ya existe',
});

const Category = mongoose.model('Category', CategorySchema);

export default Category;
