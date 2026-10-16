import { Action as Action } from './Action';
import { ActionProfile as ProfileAction } from './ActionProfile';

export interface BaseFeature<TActions> {
  actions: TActions[];
  code: string;
  featureName: string;
  id: number;
}

export type Feature = BaseFeature<Action>;
export type ProfileFeatureBase = BaseFeature<ProfileAction>;
