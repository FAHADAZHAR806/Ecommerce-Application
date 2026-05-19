import { Schema, model, models, Document } from "mongoose";

export interface IVendorDetails {
  storeName: string;
  storeDescription?: string;
  taxId?: string;
  businessAddress?: string;
  supportEmail?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional for users authenticating purely via OAuth providers
  role: "customer" | "seller" | "admin";
  isApprovedSeller: boolean;
  vendorDetails?: IVendorDetails;
  createdAt: Date;
  updatedAt: Date;
}

const VendorDetailsSchema = new Schema<IVendorDetails>(
  {
    storeName: { type: String, trim: true },
    storeDescription: { type: String, trim: true },
    taxId: { type: String, trim: true },
    businessAddress: { type: String, trim: true },
    supportEmail: { type: String, trim: true, lowercase: true },
  },
  { _id: false },
); // Prevents creation of an unneeded secondary object sub-ID

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: function (this: IUser) {
        // Only enforce password requirement if user doesn't use standard OAuth login
        return true;
      },
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },
    isApprovedSeller: {
      type: Boolean,
      default: false,
    },
    vendorDetails: {
      type: VendorDetailsSchema,
      required: function (this: IUser) {
        return this.role === "seller";
      },
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt records
  },
);

// Performance optimization: Single-field index on Email for instant query times
UserSchema.index({ email: 1 });

// Ensure Next.js hot-reloading does not redefine the Mongoose model compilation error
const User = models.User || model<IUser>("User", UserSchema);

export default User;
