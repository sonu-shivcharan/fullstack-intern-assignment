import { apiClient } from "../lib/api-client";
import type { ApiResponse } from "@/types/api";

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface UserListItem {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "STORE_OWNER";
  address: string;
  createdAt: string;
}

export async function getAdminDashboardStats(): Promise<DashboardStats> {
  const res =
    await apiClient.get<ApiResponse<DashboardStats>>("/admin/dashboard");
  return res.data.data;
}

export async function getAdminUsers(params: {
  page: number;
  limit: number;
  sortBy: string;
  order: "asc" | "desc";
  search?: string;
  role?: string;
}): Promise<UserListItem[]> {
  const res = await apiClient.get<ApiResponse<UserListItem[]>>("/admin/users", {
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
