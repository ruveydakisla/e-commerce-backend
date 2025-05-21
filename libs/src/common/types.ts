import { SortOrder } from "users/constants";

export type PaginationOptions = {
  page: number;
  limit: number;
  sort: string;
  order: SortOrder;
};
