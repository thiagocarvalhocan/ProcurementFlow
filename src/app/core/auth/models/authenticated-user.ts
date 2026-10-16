import { UserFeature } from './user-feature';

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  employeeId: string;
  regionOfficeId: number;
  regionOfficeName: string;
  unitId: number;
  unitName: string;
  accessDeniedEmail: string;
  isMonthlyRequestAccountant: boolean;
  monthlyRequestAccountantUnitIds: number[];
  features: UserFeature[];
}
