import { apiClient } from "../lib/api-client";
import type { ApiResponse } from "@/types/api";

export interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  createdAt: string;
}

export interface StoreDetails {
  id: number;
  name: string;
  email: string;
  address: string;
  avgRating: string | number | null;
  createdAt: string;
}

export interface UserRatingDetail {
  id: number;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
  };
}

export async function getUserStores(search?: string): Promise<Store[]> {
  const params = search ? { search } : {};
  const res = await apiClient.get<ApiResponse<{ stores: Store[] }>>("/stores", {
    params,
  });
  return res.data.data.stores;
}

export async function getUserStoreDetails(
  storeId: number
): Promise<StoreDetails> {
  const res = await apiClient.get<ApiResponse<{ store: StoreDetails }>>(
    `/stores/${storeId}`
  );
  return res.data.data.store;
}

export async function getStoreRatings(
  storeId: number
): Promise<UserRatingDetail[]> {
  const res = await apiClient.get<ApiResponse<{ ratings: UserRatingDetail[] }>>(
    `/ratings/${storeId}`
  );
  return res.data.data.ratings;
}

export async function createStoreRating(
  storeId: number,
  payload: { rating: number; review: string }
): Promise<any> {
  const res = await apiClient.post<ApiResponse<any>>(
    `/ratings/${storeId}`,
    payload
  );
  return res.data.data;
}

export async function updateStoreRating(
  ratingId: number,
  payload: { rating: number; review: string }
): Promise<any> {
  const res = await apiClient.patch<ApiResponse<any>>(
    `/ratings/${ratingId}`,
    payload
  );
  return res.data.data;
}
