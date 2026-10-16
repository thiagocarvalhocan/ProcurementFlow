export interface PaginatedResult<TResponse> {
  totalPages: number;
  totalElements: number;
  data: TResponse;
}
