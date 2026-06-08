import type { ApiErrorResponse } from "@/types/api";
import axios, { type AxiosError } from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const serverErr = error.response;
    const data = serverErr?.data as ApiErrorResponse | undefined;

    if (data?.message) {
      error.message = data.message;
    }
    return Promise.reject(error);
  }
);
