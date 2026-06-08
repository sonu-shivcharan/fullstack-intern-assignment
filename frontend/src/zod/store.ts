import { z } from "zod";

export const addStoreSchema = z.object({
  name: z
    .string()
    .min(3, "Store name must be at least 3 characters")
    .max(60, "Store name must be at most 60 characters"),
  email: z.email("Invalid email address"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(400, "Address must be at most 400 characters"),
  ownerId: z.number("Owner is required"),
});

export type AddStoreFormValues = z.infer<typeof addStoreSchema>;
