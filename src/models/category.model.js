import mongoose, { Schema } from 'mongoose';

const category = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    subCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Subcategory',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.models.Category || mongoose.model('Category', category);
