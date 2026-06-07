import { apiClient } from "../lib/api-client";
import type { User } from "@/types/user";
import type { ApiResponse } from "@/types/api";
import { z } from "zod";
import { signinSchema, signupSchema } from "@/zod/auth";

type SigninFormValues = z.infer<typeof signinSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

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
