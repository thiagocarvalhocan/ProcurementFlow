import { User } from '../User';

export interface UserControl extends User {
  profileNames: string[];
  unitId: number;
}
