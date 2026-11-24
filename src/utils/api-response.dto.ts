export class ApiResponseDto<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;

  constructor(
    data: T | null,
    message: string,
    statusCode: number,
    meta: ApiResponseDto<T>['meta'] = null,
  ) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}