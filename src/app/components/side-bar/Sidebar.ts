import { IconHomeTrendUpComponent } from '../icons/icon-home-trend-up/icon-home-trend-up.component';
import { IconProfileComponent } from '../icons/icon-profile/icon-profile.component';
import { IconUserComponent } from '../icons/icon-user/icon-user.component';
import { FeatureCode } from '../../core/auth/feature-codes';

export const navItems = [
  {
    route: '/',
    icon: IconHomeTrendUpComponent,
    name: 'Home',
    feature: '',
  },
  {
    route: '/users',
    icon: IconUserComponent,
    name: 'Users',
    feature: FeatureCode.Users,
  },
  {
    route: '/profiles',
    icon: IconProfileComponent,
    name: 'Profiles',
    feature: FeatureCode.Profiles,
  },
];

