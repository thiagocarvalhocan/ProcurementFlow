export interface LinkedUnit {
  skip: number;
  take: number;
  UnitDescription: string | null;
  RajIds: (string | number | boolean)[] | null;
  SortBy: string;
  SortDirection: string;
  idMaterialService: number;
}
