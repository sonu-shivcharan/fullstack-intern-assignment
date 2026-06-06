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
