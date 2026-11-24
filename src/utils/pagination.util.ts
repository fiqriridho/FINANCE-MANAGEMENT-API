export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export function calculatePagination(
  totalItems: number,
  page = 1,
  limit = 10,
): { skip: number; limit: number; meta: PaginationMeta } {
  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const totalPages = Math.ceil(totalItems / safeLimit);
  const skip = (safePage - 1) * safeLimit;

  return {
    skip,
    limit: safeLimit,
    meta: {
      page: safePage,
      limit: safeLimit,
      totalItems,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
    },
  };
}
