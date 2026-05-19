import * as z from "zod";

export const productFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long." }),
  category: z
    .string()
    .min(2, {
      message: "Please select a valid structural category classification.",
    }),
  // Using native coercion maps the underlying types directly to an explicit 'number'
  basePrice: z.coerce
    .number()
    .min(0, { message: "Base price cannot be negative." }),
  imageUrl: z
    .string()
    .url({ message: "Please supply a valid image asset URL link." }),
  sku: z
    .string()
    .min(4, {
      message: "SKU designation is mandatory for tracking inventory states.",
    }),
  stock: z.coerce
    .number()
    .int()
    .min(0, { message: "Initial stock volume cannot be negative." }),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;
