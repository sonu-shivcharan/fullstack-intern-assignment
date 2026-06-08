export function paginatedResponse<T>(data: T[], limit: number, page: number) {
  const hasMore = data.length > limit;
  const returnData = hasMore ? data.slice(0, limit) : data;

  return {
    docs: returnData,
    hasMore,
    nextPage: hasMore ? page + 1 : null,
  } as {
    docs: T[];
    hasMore: boolean;
    nextPage: number | null;
  };
}
