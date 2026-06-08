import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(16, "Password must be at most 16 characters")
  .regex(
    /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/,
    "Password must contain one uppercase letter and one special character"
  );

export const signupSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(60, "Name must be at most 60 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().max(400, "Address must be at most 400 characters"),
  password: passwordSchema,
});

export const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: passwordSchema,
});

export type SignupFormValues = z.infer<typeof signupSchema>;
export type SigninFormValues = z.infer<typeof signinSchema>;
