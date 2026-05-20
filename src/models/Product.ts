import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 10 },
    sellerId: { type: String, required: true },
    sellerName: { type: String, required: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Product = models.Product || model("Product", ProductSchema);
