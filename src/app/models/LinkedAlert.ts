export interface LinkedAlert {
  skip: number;
  take: number;
  Description: string | null;
  UnitName: string | null;
  regionOfficeIds: (string | number | boolean)[] | null;
  SortBy: string;
  SortDirection: 'Ascending' | 'Descending';
  materialServiceId: number;
}
