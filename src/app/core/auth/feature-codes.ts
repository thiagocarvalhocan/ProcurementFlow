
export const FeatureCode = {
  Home: 'Home',
  Users: 'Users',
  Profiles: 'Profiles',
  Units: 'Units',
  AdvanceRequest: 'AdvanceRequest',
  RequestMessage: 'RequestMessage',
} as const;

export type FeatureCode = (typeof FeatureCode)[keyof typeof FeatureCode];

export const ActionCode = {
  View: 'View',
  Create: 'Create',
  Edit: 'Edit',
  Delete: 'Delete',
} as const;

export type ActionCode = (typeof ActionCode)[keyof typeof ActionCode];
