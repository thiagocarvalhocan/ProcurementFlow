import { Feature } from '../BaseFeature';

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  employeeId: string;
  unitId: number;
  regionOfficeName: string;
  unitName: string;
  linkedToMonthlyRequest: boolean;
  features: Feature[];
  accessDeniedEmail: string;
  monthlyRequestAccountantUnitIds: number[];
}
