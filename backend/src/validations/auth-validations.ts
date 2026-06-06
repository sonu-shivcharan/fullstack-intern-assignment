import { z } from "zod";
import { UserRoleSchema, type UserRole } from "../db/schema";

export const passwordSchema = z
  .string()
  .min(8)
  .max(16)
  .regex(
    /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/,
    "Password must contain one uppercase letter and one special character",
  );

export const signupSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(60, "Name must be at most 60 characters"),

  email: z.email(),

  address: z.string().max(400, "Address must be at most 400 characters"),

  password: passwordSchema,
  role: UserRoleSchema.optional(),
});

export const signinSchema = z.object({
  email: z.email(),
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: passwordSchema,
});
