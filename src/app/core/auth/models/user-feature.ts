import { FeatureAction } from './feature-action';

export interface UserFeature {
  id: number;
  name: string;
  code: string;
  actions: FeatureAction[];
}
