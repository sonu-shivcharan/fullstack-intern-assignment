import { apiClient } from "../lib/api-client";
import type { z } from "zod";
import type {
  signinSchema,
  signupSchema,
  changePasswordSchema,
} from "@/zod/auth";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/user";

type SigninFormValues = z.infer<typeof signinSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export async function getCurrentUser(): Promise<User | null> {
  const response = await apiClient.get<ApiResponse<User>>("/auth/me");
  return response.data.data;
}

export async function signUp(values: SignupFormValues): Promise<User> {
  const response = await apiClient.post<ApiResponse<{ user: User }>>(
    "/auth/users/signup",
    values
  );
  return response.data.data.user;
}

export async function signIn(values: SigninFormValues): Promise<User> {
  const response = await apiClient.post<ApiResponse<{ user: User }>>(
    "/auth/signin",
    values
  );
  return response.data.data.user;
}

export async function signOut(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function changePassword(
  values: ChangePasswordFormValues
): Promise<void> {
  await apiClient.post<ApiResponse<any>>("/auth/change-password", values);
}
