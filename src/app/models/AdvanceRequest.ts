import { Month } from './Month';

export interface AdvanceRequest {
  id: number;
  unitId: number;
  unitDescription: string;
  budgetTypeIds: number;
  budgetTypeDescription: string;
  year: number;
  requestedMonths: string;
  lastUpdatedDate: string;
  budgetValue: number;
  message: string;
  months: Month[];
}
