export type TotalField = 'totalByCompany' | 'totalMostAdvantageous';

export interface TotalRow {
  label: string;
  field: TotalField;
  highlightLowest?: boolean;
}
