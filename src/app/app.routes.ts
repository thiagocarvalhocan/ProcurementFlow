import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RedirectCallbackComponent } from './pages/redirect-callback/redirect-callback.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';
import { NoPermissionComponent } from './pages/no-permission/no-permission.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserComponent } from './pages/user/user.component';
import { RequestMessageComponentt } from './pages/request-message/request-message.component';
import { AdvanceRequestComponent } from './pages/advance-request/advance-request.component';
import { UnitPanelComponent } from './pages/units/unit-panel/unit-panel.component';
import { unitResolver } from './resolver/unidade.resolver';
import { UnitsComponent } from './pages/units/units.component';
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'Home',
      },
      {
        path: 'users',
        component: UserComponent,
        title: 'Users',
      },
      {
        path: 'profiles',
        component: ProfileComponent,
        title: 'Profiles',
      },
      {
        path: 'advance-request',
        component: AdvanceRequestComponent,
        title: 'Advance Request'
      },
      {
        path: 'administration',
        children: [
          {
            path: 'request-messages',
            component: RequestMessageComponentt,
            title: 'Request Message'
          },
          {
            path: 'units/:idUnit/view',
            component: UnitPanelComponent,
            title: 'View Unit',
            resolve: { unidade: unitResolver }
          },{
            path: 'units/:idUnit/edit',
            component: UnitPanelComponent,
            title: 'Edit Unit',
            resolve: { unidade: unitResolver }
          },
          {
            path: 'units/new',
            component: UnitPanelComponent,
            title: 'Add Unit'
          },
          {
            path: 'units',
            component: UnitsComponent,
            title: 'Units'
          },
        ]
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [loginGuard],
      },
      {
        path: 'redirect-callback',
        component: RedirectCallbackComponent,
      },
      {
        path: 'no-permission',
        component: NoPermissionComponent,
      },
      {
        path: 'no-access',
        component: NoPermissionComponent,
      },
      {
        path: 'disabled-user',
        component: NoPermissionComponent,
      },
    ],
  },
];
