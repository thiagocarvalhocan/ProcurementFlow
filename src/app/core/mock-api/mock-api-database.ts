import { ActionCode, FeatureCode } from '../auth/feature-codes';
import { MOCK_ACCOUNTS } from '../auth/mock-auth-data';
import { FeatureAction } from '../auth/models/feature-action';
import { UserFeature } from '../auth/models/user-feature';
import {
  MockEntityEvent,
  MockProfile,
  MockProfileFeature,
  MockUnit,
  MockUser,
} from './mock-api.models';

const ALL_ACTIONS: ActionCode[] = [
  ActionCode.View,
  ActionCode.Create,
  ActionCode.Edit,
  ActionCode.Delete,
];
const EDIT_ACTIONS: ActionCode[] = [ActionCode.View, ActionCode.Edit];

const buildActions = (codes: ActionCode[]): FeatureAction[] =>
  codes.map((code, index) => ({ id: index + 1, description: code, code }));

/** Feature catalogue offered by the mock API. Every feature carries the 4 canonical actions. */
export const MOCK_FEATURE_CATALOG: UserFeature[] = [
  { id: 1, name: 'User Management', code: FeatureCode.Users, actions: buildActions(ALL_ACTIONS) },
  { id: 2, name: 'Profile Management', code: FeatureCode.Profiles, actions: buildActions(ALL_ACTIONS) },
  { id: 3, name: 'Unit Management', code: FeatureCode.Units, actions: buildActions(ALL_ACTIONS) },
];

type FeatureGrant = { featureId: number; actions: string[] };

/** MOCK seed builder: stores every catalog feature with its granted (checked) action state. */
const grantFeatures = (grants: FeatureGrant[]): MockProfileFeature[] =>
  MOCK_FEATURE_CATALOG.map((feature) => {
    const grant = grants.find((item) => item.featureId === feature.id);

    return {
      id: feature.id,
      name: feature.name,
      code: feature.code,
      isActive: grant !== undefined,
      actions: feature.actions.map((action) => ({
        ...action,
        isActive: grant !== undefined && grant.actions.includes(action.code),
      })),
    };
  });

export const MOCK_UNITS: MockUnit[] = [
  { id: 1003072, code: 'U-001', name: 'Procurement Demo Unit', regionOfficeId: 2, regionOfficeName: '02nd Regional Office', isActive: true },
  { id: 1000000, code: 'U-002', name: 'Headquarters Unit', regionOfficeId: 1, regionOfficeName: 'Headquarters', isActive: true },
  { id: 1001045, code: 'U-003', name: 'Accounting Support Unit', regionOfficeId: 2, regionOfficeName: '02nd Regional Office', isActive: true },
  { id: 1002110, code: 'U-004', name: 'Logistics Unit', regionOfficeId: 3, regionOfficeName: '03rd Regional Office', isActive: true },
  { id: 1004500, code: 'U-005', name: 'Contracts Unit', regionOfficeId: 4, regionOfficeName: '04th Regional Office', isActive: true },
  { id: 1005800, code: 'U-006', name: 'Legacy Unit (inactive)', regionOfficeId: 5, regionOfficeName: '05th Regional Office', isActive: false },
];

export const MOCK_PROFILES: MockProfile[] = [
  { id: 1, name: 'Super Administrator', description: 'Full access to every feature of the system', accessDeniedEmail: 'support@procurementflow.demo', allowEditing: false, features: grantFeatures([
      { featureId: 1, actions: ALL_ACTIONS },
      { featureId: 2, actions: ALL_ACTIONS },
      { featureId: 3, actions: ALL_ACTIONS },
    ]), createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-05-02T14:30:00Z' },
  { id: 2, name: 'Procurement Manager', description: 'Manages users and reviews advance requests', accessDeniedEmail: 'support@procurementflow.demo', allowEditing: true, features: grantFeatures([
      { featureId: 1, actions: ALL_ACTIONS },
      { featureId: 3, actions: EDIT_ACTIONS },
    ]), createdAt: '2024-02-01T08:15:00Z', updatedAt: '2024-04-18T11:05:00Z' },
  { id: 3, name: 'Procurement Analyst', description: 'Creates and follows up procurement requests', accessDeniedEmail: 'support@procurementflow.demo', allowEditing: true, features: grantFeatures([
      { featureId: 3, actions: EDIT_ACTIONS },
    ]), createdAt: '2024-02-12T10:40:00Z', updatedAt: '2024-03-30T16:20:00Z' },
  { id: 4, name: 'Accountant', description: 'Reviews monthly requests of the assigned units', accessDeniedEmail: 'support@procurementflow.demo', allowEditing: true, features: grantFeatures([
      { featureId: 1, actions: ALL_ACTIONS },
      { featureId: 2, actions: ALL_ACTIONS },
    ]), createdAt: '2024-03-05T07:50:00Z', updatedAt: '2024-06-01T09:10:00Z' },
  { id: 5, name: 'Read-only Viewer', description: 'Reads dashboards without editing permission', accessDeniedEmail: 'support@procurementflow.demo', allowEditing: true, features: grantFeatures([
      { featureId: 1, actions: [ActionCode.View] },
    ]), createdAt: '2024-04-22T13:25:00Z', updatedAt: '2024-06-15T15:45:00Z' },
];

const profileSummary = (profile: MockProfile) => ({
  id: profile.id,
  name: profile.name,
});

const authUsers: MockUser[] = MOCK_ACCOUNTS.map((account, index) => ({
  id: account.user.id,
  name: account.user.name,
  email: account.user.email,
  employeeId: account.user.employeeId ?? String(334444 + index),
  jobTitle:
    account.label === 'Administrator' ? 'System Administrator' : 'Business Analyst',
  phone: `(11) 4000-000${index + 1}`,
  isActive: true,
  unitId: account.user.unitId ?? 1003072,
  unitName: account.user.unitName ?? 'Procurement Demo Unit',
  profiles: [profileSummary(MOCK_PROFILES[index === 0 ? 0 : 4])],
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2024-06-20T12:00:00Z',
}));

const FIRST_NAMES = ['Olivia', 'Liam', 'Emma', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Charlotte', 'Diego', 'Gabriela', 'Rafael', 'Helena', 'Otto', 'Beatriz', 'Marco'];
const LAST_NAMES = ['Bennett', 'Carter', 'Foster', 'Hughes', 'Rivera', 'Santos', 'Walsh', 'Zimmerman', 'Costa', 'Doyle', 'Martins', 'Price', 'Tavares', 'Vieira', 'Nunes'];
const JOB_TITLES = ['Procurement Analyst', 'Buyer', 'Contract Analyst', 'Accountant', 'Administrative Assistant', 'Category Manager'];

const generatedUsers: MockUser[] = FIRST_NAMES.map((firstName, index) => {
  const lastName = LAST_NAMES[index % LAST_NAMES.length];
  const unit = MOCK_UNITS[index % (MOCK_UNITS.length - 1)];
  const profile = MOCK_PROFILES[(index % 4) + 1];
  const day = String((index % 27) + 1).padStart(2, '0');

  return {
    id: index + 100,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@procurementflow.demo`,
    employeeId: String(400000 + index * 7),
    jobTitle: JOB_TITLES[index % JOB_TITLES.length],
    phone: `(1${index % 9}) 9${String(1000 + index).padStart(4, '0')}-00${index % 10}`,
    isActive: index % 7 !== 3,
    unitId: unit.id,
    unitName: unit.name,
    profiles: [profileSummary(profile)],
    createdAt: `2024-0${(index % 6) + 1}-${day}T09:00:00Z`,
    updatedAt: `2024-07-${day}T10:30:00Z`,
  };
});

/** Mutable in-memory collection used by the mock API handlers. */
export const MOCK_USERS: MockUser[] = [...authUsers, ...generatedUsers];

export const MOCK_EVENTS: MockEntityEvent[] = [
  { id: 1, entityName: 'User', entityId: 1, action: 'Record created', userName: 'System Seed', date: '2024-01-15T08:00:00Z' },
  { id: 2, entityName: 'User', entityId: 1, action: 'Profile assigned: Super Administrator', userName: 'Alice Administrator', date: '2024-02-03T10:12:00Z' },
  { id: 3, entityName: 'User', entityId: 1, action: 'Record updated', userName: 'Alice Administrator', date: '2024-06-20T12:00:00Z' },
];

export function nextMockId(collection: { id: number }[]): number {
  return collection.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

