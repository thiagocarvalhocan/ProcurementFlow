/**
 * Identifiers used by the permission engine.
 * Values must match the `code` fields returned by the fake API,
 * the sidebar navigation items and the feature protection of each page.
 */
export const FeatureCode = {
  Home: 'Home',
  Users: 'Users',
  Profiles: 'Profiles',
  Units: 'Units',
} as const;

export type FeatureCode = (typeof FeatureCode)[keyof typeof FeatureCode];

export const ActionCode = {
  View: 'View',
  Create: 'Create',
  Edit: 'Edit',
  Delete: 'Delete',
} as const;

export type ActionCode = (typeof ActionCode)[keyof typeof ActionCode];
