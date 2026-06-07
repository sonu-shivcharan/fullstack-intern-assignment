import z from "zod";

export const storeCreateSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(60, "Name must be at most 60 characters"),

  email: z.email(),

  address: z.string().max(400, "Address must be at most 400 characters"),
  ownerId: z.number(),
});

export const storeIdParamSchema = z.object({
  storeId: z
    .string()
    .regex(/^\d+$/, "Store ID must be a numeric string")
    .transform((val) => Number(val)),
});

export const getStoresQuerySchema = z.object({
  search: z.string().optional(),
  page: z
    .string()
    .optional()
    .transform((val) => Number(val)),
  limit: z
    .string()
    .optional()
    .transform((val) => Number(val)),
  sortBy: z
    .enum(["name", "email", "address", "createdAt", "updatedAt"])
    .optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export type GetStoresQuerySchema = z.infer<typeof getStoresQuerySchema>;

