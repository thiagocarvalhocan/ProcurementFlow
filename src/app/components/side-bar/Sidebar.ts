import { IconHomeTrendUpComponent } from '../icons/icon-home-trend-up/icon-home-trend-up.component';
import { IconProfileComponent } from '../icons/icon-profile/icon-profile.component';
import { IconUserComponent } from '../icons/icon-user/icon-user.component';
import { FeatureCode } from '../../core/auth/feature-codes';
import { IconSettingsComponent } from '../icons/icon-settings/icon-settings.component';
import { IconMessageComponent } from '../icons/icon-message/icon-message.component';
import { IconReceipt2Component } from '../icons/icon-receipt-2/icon-receipt-2.component';
import { IconUnitComponent } from '../icons/icon-unit/icon-unit.component';
import { IconMapPinPlusComponent } from '../icons/icon-map-pin-plus/icon-map-pin-plus.component';
import { IconEdit3PencilComponent } from '../icons/icon-edit-3-pencil/icon-edit-3-pencil.component';
import { IconViewEyeComponent } from '../icons/icon-view-eye/icon-view-eye.component';

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
  {
    route: '/advance-request',
    icon: IconReceipt2Component,
    name: 'Advance Request',
    feature: FeatureCode.AdvanceRequest,
  },
  {
    name: 'Administration',
    route: '/administration',
    icon: IconSettingsComponent,
    feature: '',
    subItems: [
      {
        route: '/request-messages',
        icon: IconMessageComponent,
        name: 'Request Messages',
        feature: 'RequestMessage',
      },
      {
        route: '/units',
        icon: IconUnitComponent,
        name: 'Units',
        feature: 'Units',
        subItems: [
          {
            route: '/new',
            icon: IconMapPinPlusComponent,
            name: 'Add Unit',
            feature: '',
            visibleInMenu: false,
          },
          {
            route: '/:id/edit',
            icon: IconEdit3PencilComponent,
            name: 'Edit Unit',
            feature: '',
            visibleInMenu: false,
          },
          {
            route: '/:id/view',
            icon: IconViewEyeComponent,
            name: 'View Unit',
            feature: '',
            visibleInMenu: false,
          },
        ],
      },
    ],
  },
];
