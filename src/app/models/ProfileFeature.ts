import { ProfileFeatureBase } from './BaseFeature';

export interface ProfileFeature extends ProfileFeatureBase {
  text?: string;
  isActive: boolean;
}
