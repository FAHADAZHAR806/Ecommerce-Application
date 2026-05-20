import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  items: Array<{
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentMethod: "Stripe" | "COD" | "PayPal";
  paymentStatus: "Pending" | "Paid" | "Failed";
  deliveryStatus: "Processing" | "Shipped" | "In-Transit" | "Delivered";
  trackingNumber: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Stripe", "COD", "PayPal"],
    },
    paymentStatus: {
      type: String,
      required: true,
      default: "Pending",
      enum: ["Pending", "Paid", "Failed"],
    },
    deliveryStatus: {
      type: String,
      required: true,
      default: "Processing",
      enum: ["Processing", "Shipped", "In-Transit", "Delivered"],
    },
    trackingNumber: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export const Order = models.Order || model<IOrder>("Order", OrderSchema);
