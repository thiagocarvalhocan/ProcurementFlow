export interface MaterialServiceUnit {
  skip?: number;
  take?: number;
  sortBy?: string;
  sortDirection?: string;
  [key: string]: string | number | boolean | undefined;
}
