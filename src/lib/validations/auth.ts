import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." }),
    role: z.string().refine((val) => val === "customer" || val === "seller", {
      message: "Please select an account type.",
    }),
    storeName: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.role === "seller" &&
        (!data.storeName || data.storeName.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Store name is required for vendor accounts.",
      path: ["storeName"],
    },
  );

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
