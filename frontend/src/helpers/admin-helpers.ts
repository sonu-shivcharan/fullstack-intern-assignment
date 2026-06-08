import type { User } from "@/types/user";
import { apiClient } from "../lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { SearchParams } from "@/types/search";

export type DashboardStats = {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
};

export type GetAdminUsersParams = SearchParams & {
  role?: string;
};

export async function getAdminDashboardStats(): Promise<DashboardStats> {
  const res =
    await apiClient.get<ApiResponse<DashboardStats>>("/admin/dashboard");
  return res.data.data;
}

export async function getAdminUsers(
  params: GetAdminUsersParams,
): Promise<User[]> {
  const res = await apiClient.get<ApiResponse<User[]>>("/admin/users", {
    params,
  });
  return res.data.data;
}

export async function createAdminUser(payload: any): Promise<any> {
  const res = await apiClient.post<ApiResponse<any>>("/admin/users", payload);
  return res.data.data;
}

export async function createAdminStore(payload: any): Promise<any> {
  const res = await apiClient.post<ApiResponse<any>>("/admin/stores", payload);
  return res.data.data;
}
