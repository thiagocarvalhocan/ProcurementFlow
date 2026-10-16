import { ProfileFeature as ProfileFeature } from './ProfileFeature';

export interface ProfileBase {
  id?: number;
  name?: string;
  description?: string;
  profileId: number;
  profileName: string;
  profileText: string;

  allowEditing: boolean;
  accessDeniedEmail?: string;
  features: ProfileFeature[];
}
