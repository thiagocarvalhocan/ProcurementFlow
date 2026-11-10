export interface MaterialServicesByBudgetResponse {
  materialServiceId: number;
  description: string;
  startDate: string | null;
  endDate: string | null;
  descriptionTypeMaterial: string;
  descriptionRule: string;
  onSchedule: boolean;
}
