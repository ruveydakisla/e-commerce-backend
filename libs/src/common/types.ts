import { SortOrder } from "users/constants";

export type PaginationOptions = {
  page: number;
  limit: number;
  sort: string;
  order: SortOrder;
};
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
export interface ApiResponse<T> {
  success: boolean;
  timestamp: string;
  data: T;
}
export interface ApiErrorResponse {
  success: boolean;
  timestamp: string;
}
