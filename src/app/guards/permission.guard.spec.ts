import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

import { PermissionGuard } from './permission.guard';
import { UserPermissionService } from '../services/user-permission.service';
import { MOCK_ACCOUNTS } from '../core/auth/mock-auth-data';

@Component({ selector: 'app-no-permission-stub', template: '' })
class NoPermissionStubComponent {}

describe('PermissionGuard', () => {
  const buildRoute = (feature: string): ActivatedRouteSnapshot =>
    ({ data: { featureCode: feature } } as unknown as ActivatedRouteSnapshot);

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'auth/no-permission', component: NoPermissionStubComponent },
        ]),
      ],
      providers: [PermissionGuard],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(PermissionGuard)).toBeTruthy();
  });

  it('blocks a feature the session does not own', async () => {
    const guard = TestBed.inject(PermissionGuard);

    expect(guard.canActivate(buildRoute('Profiles'))).toBeFalse();

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(TestBed.inject(Router).url).toBe('/auth/no-permission');
  });

  it('allows a feature the session owns', () => {
    TestBed.inject(UserPermissionService).setCurrentUser(MOCK_ACCOUNTS[0].user);

    expect(
      TestBed.inject(PermissionGuard).canActivate(buildRoute('Profiles'))
    ).toBeTrue();
  });
});
