export interface EventPaged {
  first?: number;
  rows?: number | null;
  sortField?: string | string[] | null ;
  sortOrder?: number | null | string;
  page?: number | null;
}
