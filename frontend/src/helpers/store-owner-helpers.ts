import { apiClient } from "../lib/api-client";
import type { ApiResponse } from "@/types/api";

export interface StoreDetail {
  id: number;
  name: string;
  email: string;
  address: string;
  averageRating: string | number | null;
  totalRatings: number;
}

export interface OwnerDashboardData {
  store: StoreDetail;
}

export interface UserRating {
  id: number;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithRating {
  id: number;
  name: string;
  address: string;
  rating: UserRating;
}

export async function getStoreOwnerDashboard(): Promise<OwnerDashboardData> {
  const res = await apiClient.get<
    ApiResponse<{ dashboard: OwnerDashboardData }>
  >("/store-owner/dashboard");
  return res.data.data.dashboard;
}

export async function getStoreOwnerRatings(): Promise<UserWithRating[]> {
  const res =
    await apiClient.get<ApiResponse<{ users: UserWithRating[] }>>(
      "/store-owner/users"
    );
  return res.data.data.users;
}

export interface PagedRatingsResponse {
  users: UserWithRating[];
  nextPage: number | null;
  hasMore: boolean;
}

export async function getStoreOwnerRatingsPaged(params: {
  page: number;
  limit: number;
  order: "asc" | "desc";
}): Promise<PagedRatingsResponse> {
  const res = await apiClient.get<ApiResponse<PagedRatingsResponse>>(
    "/store-owner/users",
    { params }
  );
  return res.data.data;
}

