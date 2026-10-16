export interface Alert {
  materialServiceAlertTypeId: number;
  regionOfficeIds: number[];
  startDate: string | null;
  endDate: string | null;
  description: string;
  unitIds: number[] | null;
}
