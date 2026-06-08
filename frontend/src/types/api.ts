export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface ApiErrorResponse {
  message: string;
  name: string;
  statusCode: number;
  success: false;
  errors: any;
}

export interface PaginatedResponse<T> {
  docs: T[];
  hasMore: boolean;
  nextPage: number | null;
}
