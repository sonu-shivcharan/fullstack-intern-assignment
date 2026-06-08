export type SearchParams = {
  page: number;
  limit: number;
  sortBy: string;
  order: "asc" | "desc";
  search?: string;
};
