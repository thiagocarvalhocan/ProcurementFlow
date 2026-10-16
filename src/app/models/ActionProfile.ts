import { Action } from './Action';

export interface ActionProfile extends Omit<Action, 'description'> {
  action: string;
  isActive: boolean;
  isChecked: boolean;
  isDisabled: boolean;
  exclusiveFeatureId: number | null;
}
