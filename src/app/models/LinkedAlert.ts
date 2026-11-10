export interface LinkedAlert {
  skip: number;
  take: number;
  Description: string | null;
  UnitSofName: string | null;
  IdsRajs: (string | number | boolean)[] | null;
  SortBy: string;
  SortDirection: 'Ascending' | 'Descending';
  materialServiceId: number;
}
