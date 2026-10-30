export interface Page<T> {
  totalElements: number;
  totalPages: number;
  data: T[];
}