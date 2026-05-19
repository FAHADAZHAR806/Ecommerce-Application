import { Schema, model, models, Document, Types } from "mongoose";

export interface IProductVariant {
  name: string; // e.g., "Size: M", "Color: Deep Obsidian"
  sku: string; // Stock Keeping Unit for strict inventory tracking
  price: number;
  stock: number;
}

export interface IProduct extends Document {
  sellerId: Types.ObjectId;
  title: string;
  slug: string; // URL-friendly unique handle
  description: string;
  images: string[];
  category: string;
  basePrice: number;
  discountPrice?: number;
  variants: IProductVariant[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    name: { type: String, required: true, trim: true },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
  },
  { _id: false },
);

const ProductSchema = new Schema<IProduct>(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [
        true,
        "A product must be explicitly linked to a seller account",
      ],
    },
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Product slug handle is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    images: {
      type: [String],
      required: [true, "At least one product visual asset is required"],
      validate: [
        (val: string[]) => val.length > 0,
        "Product must contain at least one image link",
      ],
    },
    category: {
      type: String,
      required: [true, "Category classification is required"],
      trim: true,
      lowercase: true,
    },
    basePrice: {
      type: Number,
      required: [true, "Base price criteria is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      validate: {
        validator: function (this: IProduct, value: number) {
          // Only validate if a discount price is actually provided
          if (!value) return true;
          return value < this.basePrice;
        },
        message:
          "Discounted price must be strictly less than the baseline price",
      },
    },
    variants: [ProductVariantSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// High-Performance Optimization: Compound Text Indexes for instant semantic search
ProductSchema.index({ title: "text", description: "text", category: "text" });
// Relational Indexing: Fast lookups for vendor-specific inventories
ProductSchema.index({ sellerId: 1, category: 1 });

const Product = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;
