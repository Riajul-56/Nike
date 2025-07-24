import mongoose, { Schema } from 'mongoose';

const category = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    subCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory', 
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.models.Category || mongoose.model('Category', category);
