import { z } from "zod";

// Sweet Categories (matching your backend enum)
const SweetCategory = [
  "Milk Sweet",
  "Dry Fruit", 
  "Syrup Based",
  "Flour Based",
  "Other"
];

export const registerSchema = z.object({
  username: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Email must be in correct form"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export const loginSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Email must be in correct form"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const sweetSchema = z.object({
  name: z.string().min(2, "Sweet name must be at least 2 characters"),
  category: z.enum(SweetCategory),
  price: z.number().positive("Price must be greater than 0"),
  quantity: z.number().int().nonnegative("Quantity must be >= 0"),
});

export const sweetSearchSchema = z.object({
  name: z.string().optional(),
  category: z.enum(SweetCategory).optional(),
  minPrice: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "minPrice must be a number")
    .transform(Number)
    .optional(),
  maxPrice: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "maxPrice must be a number")
    .transform(Number)
    .optional(),
});

export const sweetUpdateSchema = z.object({
  name: z.string().min(2, "Sweet name must be at least 2 characters").optional(),
  category: z.enum(SweetCategory).optional(),
  quantity: z.number().int().nonnegative("Quantity must be >= 0").optional(),
  price: z.number().positive("Price must be greater than 0").optional(),
}).strict();

export const sweetPurchaseSchema = z.object({
  quantity: z.number().int().positive("Quantity must be at least 1"),
}).strict();

export const sweetRestockSchema = z.object({
  quantity: z.number().int().positive("Quantity must be at least 1"),
}).strict();

// Types
export const SWEET_CATEGORIES = SweetCategory;