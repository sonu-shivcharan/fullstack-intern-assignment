import { z } from "zod";

export const createRatingBodySchema = z.object({
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  review: z
    .string()
    .max(255, "Review must be at most 255 characters")
    .optional(),
});

export const editRatingBodySchema = z.object({
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5")
    .optional(),
  review: z
    .string()
    .max(255, "Review must be at most 255 characters")
    .optional(),
});

export const ratingIdParamSchema = z.object({
  ratingId: z
    .string()
    .regex(/^\d+$/, "Rating ID must be a numeric string")
    .transform((val) => Number(val)),
});
