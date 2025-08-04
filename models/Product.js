import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    tag: { type: String },

    oldPrice: { type: String, required: true },
    currentPrice: { type: String, required: true },

    sizes: { type: [String], required: true },
    images: { type: Object, required: true },
    searchable: { type: [String], default: [] },

    inStock: { type: Boolean, default: true },
    shiningEffect: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
