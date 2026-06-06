import { z } from "zod";

export const getUsersQuerySchema = z.object({
  role: z.enum(["ADMIN", "USER", "STORE_OWNER"]).optional(),
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

export type GetUsersQuerySchema = z.infer<typeof getUsersQuerySchema>;
