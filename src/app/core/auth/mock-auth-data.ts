import { ActionCode, FeatureCode } from './feature-codes';
import { AuthenticatedUser } from './models/authenticated-user';
import { FeatureAction } from './models/feature-action';
import { UserFeature } from './models/user-feature';

/**
 * A demo account available in the local (offline) authentication flow.
 */
export interface MockAccount {
  email: string;
  password: string;
  label: string;
  description: string;
  user: AuthenticatedUser;
}

const fullAccessActions = (): FeatureAction[] => [
  { id: 1, description: ActionCode.View, code: ActionCode.View },
  { id: 2, description: ActionCode.Create, code: ActionCode.Create },
  { id: 3, description: ActionCode.Edit, code: ActionCode.Edit },
  { id: 4, description: ActionCode.Delete, code: ActionCode.Delete },
];

const readOnlyActions = (): FeatureAction[] => [
  { id: 1, description: ActionCode.View, code: ActionCode.View },
];

const administratorFeatures: UserFeature[] = [
  {
    id: 1,
    name: 'User Management',
    code: FeatureCode.Users,
    actions: fullAccessActions(),
  },
  {
    id: 2,
    name: 'Profile Management',
    code: FeatureCode.Profiles,
    actions: fullAccessActions(),
  },
  {
    id: 3,
    name: 'Unit Management',
    code: FeatureCode.Units,
    actions: fullAccessActions(),
  },
];

const viewerFeatures: UserFeature[] = [
  {
    id: 1,
    name: 'User Management',
    code: FeatureCode.Users,
    actions: readOnlyActions(),
  },
];

const administratorUser: AuthenticatedUser = {
  id: 1,
  name: 'Alice Administrator',
  email: 'admin@procurementflow.demo',
  employeeId: '334444',
  regionOfficeId: 2,
  regionOfficeName: '02nd Regional Office',
  unitId: 1003072,
  unitName: 'Procurement Demo Unit',
  accessDeniedEmail: 'support@procurementflow.demo',
  isMonthlyRequestAccountant: true,
  monthlyRequestAccountantUnitIds: [1000000],
  features: administratorFeatures,
};

const viewerUser: AuthenticatedUser = {
  id: 2,
  name: 'Victor Viewer',
  email: 'viewer@procurementflow.demo',
  employeeId: '334445',
  regionOfficeId: 2,
  regionOfficeName: '02nd Regional Office',
  unitId: 1003072,
  unitName: 'Procurement Demo Unit',
  accessDeniedEmail: 'support@procurementflow.demo',
  isMonthlyRequestAccountant: false,
  monthlyRequestAccountantUnitIds: [],
  features: viewerFeatures,
};

/**
 * Accounts accepted by FakeAuthApiService. Passwords are plain text on
 * purpose: this data is public demo content with no real credentials.
 */
export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    email: administratorUser.email,
    password: 'Admin@123',
    label: 'Administrator',
    description: 'Full access to Users, Profiles and Units',
    user: administratorUser,
  },
  {
    email: viewerUser.email,
    password: 'Viewer@123',
    label: 'Viewer',
    description: 'Read-only access to Users and Home',
    user: viewerUser,
  },
];

export const MOCK_DEFAULT_CREDENTIALS = {
  email: MOCK_ACCOUNTS[0].email,
  password: MOCK_ACCOUNTS[0].password,
};
