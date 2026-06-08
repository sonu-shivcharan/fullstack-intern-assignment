import { apiClient } from "../lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { Store } from "@/types/store";
import type { SearchParams } from "@/types/search";

export async function getAllStores(params: SearchParams): Promise<Store[]> {
  const res = await apiClient.get<ApiResponse<{ stores: Store[] }>>("/stores", {
    params,
  });
  return res.data.data.stores;
}
