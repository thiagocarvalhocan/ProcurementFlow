import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,

  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { firstValueFrom } from 'rxjs';

import { authGuard } from './auth.guard';
import { loginGuard } from './login.guard';
import { AuthService } from '../services/auth.service';
import { UserPermissionService } from '../services/user-permission.service';
import { AuthSessionService } from '../core/auth/auth-session.service';
import { MOCK_ACCOUNTS } from '../core/auth/mock-auth-data';
import { ActionCode, FeatureCode } from '../core/auth/feature-codes';
import { LoginComponent } from '../pages/login/login.component';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { environment } from '../../environments/environment';

const [ADMIN, VIEWER] = MOCK_ACCOUNTS;

@Component({ selector: 'app-flow-stub', template: '' })
class FlowStubComponent {}

const FLOW_ROUTES: Routes = [
  { path: '', component: FlowStubComponent, canActivate: [authGuard] },
  { path: 'users', component: FlowStubComponent, canActivate: [authGuard] },
  { path: 'auth/login', component: FlowStubComponent, canActivate: [loginGuard] },
];

const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 50));

function runGuard(guard: CanActivateFn, url: string): boolean {
  return TestBed.runInInjectionContext(() =>
    guard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot)
  ) as boolean;
}

/**
 * Acceptance checks for Phase 1B: the login form, the route guards and the
 * toolbar identity/logout wiring all run against the offline mock session.
 */
describe('Phase 1B - mock login, guards and toolbar', () => {
  let router: Router;
  let authService: AuthService;

  beforeEach(async () => {
    sessionStorage.clear();
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(FLOW_ROUTES),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
  });

  it('logs in with a demo account and stores the mock session', async () => {
    const session = await firstValueFrom(
      authService.login({ email: ADMIN.email, password: ADMIN.password })
    );

    expect(session.user.name).toBe('Alice Administrator');
    expect(session.token).toContain('.');
    expect(sessionStorage.getItem(environment.auth.sessionKey)).toBeTruthy();
    expect(authService.isAuthenticated()).toBeTrue();
    expect(authService.getUserName()).toBe('Alice Administrator');

    const permissions = TestBed.inject(UserPermissionService);
    expect(permissions.hasPermission(FeatureCode.Users, ActionCode.Edit)).toBeTrue();
  });

  it('keeps the viewer account read-only', async () => {
    await firstValueFrom(
      authService.login({ email: VIEWER.email, password: VIEWER.password })
    );

    const permissions = TestBed.inject(UserPermissionService);

    expect(permissions.hasFeature(FeatureCode.Users)).toBeTrue();
    expect(permissions.hasPermission(FeatureCode.Users, ActionCode.View)).toBeTrue();
    expect(permissions.hasPermission(FeatureCode.Users, ActionCode.Delete)).toBeFalse();
    expect(permissions.hasFeature(FeatureCode.Profiles)).toBeFalse();
  });

  it('restores the session after a page reload', async () => {
    await firstValueFrom(
      authService.login({ email: ADMIN.email, password: ADMIN.password })
    );

    const reloadedSessionService = new AuthSessionService();

    expect(reloadedSessionService.isAuthenticated()).toBeTrue();
    expect(reloadedSessionService.currentUser?.email).toBe(ADMIN.email);
  });

  it('authGuard blocks anonymous users and redirects to the login page', async () => {
    expect(runGuard(authGuard, '/users')).toBeFalse();

    await settle();

    expect(router.url).toBe('/auth/login');
    expect(TestBed.inject(AuthSessionService).currentSession).toBeNull();
  });

  it('authGuard lets an authenticated session through', async () => {
    await firstValueFrom(
      authService.login({ email: ADMIN.email, password: ADMIN.password })
    );

    expect(runGuard(authGuard, '/users')).toBeTrue();

    await router.navigate(['/users']);

    expect(router.url).toBe('/users');
  });

  it('loginGuard redirects an authenticated user to the home page', async () => {
    await firstValueFrom(
      authService.login({ email: ADMIN.email, password: ADMIN.password })
    );

    expect(runGuard(loginGuard, '/auth/login')).toBeFalse();

    await settle();

    expect(router.url).toBe('/');
  });

  it('loginGuard allows anonymous users to reach the login page', () => {
    expect(runGuard(loginGuard, '/auth/login')).toBeTrue();
  });

  it('logout clears the session and the permission engine', async () => {
    await firstValueFrom(
      authService.login({ email: ADMIN.email, password: ADMIN.password })
    );

    authService.logout();

    await settle();

    expect(TestBed.inject(AuthSessionService).currentSession).toBeNull();
    expect(TestBed.inject(UserPermissionService).getCurrentUser()).toBeNull();
    expect(router.url).toBe('/auth/login');
  });

  describe('login form', () => {
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      fixture.detectChanges();
    });

    it('rejects invalid input before calling the fake API', () => {
      const component = fixture.componentInstance;
      component.loginForm.setValue({ email: 'not-an-email', password: '' });

      component.onSubmit();

      expect(component.errorMessage).toBe(
        'Please inform a valid e-mail and password.'
      );
      expect(authService.isAuthenticated()).toBeFalse();
    });

    it('surfaces the fake API error for wrong credentials', fakeAsync(() => {
      const component = fixture.componentInstance;
      component.loginForm.setValue({
        email: ADMIN.email,
        password: 'wrong-password',
      });

      component.onSubmit();
      tick();

      expect(component.errorMessage).toBe('Invalid e-mail or password.');
      expect(authService.isAuthenticated()).toBeFalse();
    }));

    it('authenticates a demo account and navigates to the home page', fakeAsync(() => {
      const component = fixture.componentInstance;
      component.useAccount(VIEWER);

      component.onSubmit();
      tick(1000);
      fixture.detectChanges();

      expect(component.errorMessage).toBe('');
      expect(authService.isAuthenticated()).toBeTrue();
      expect(router.url).toBe('/');
      expect(TestBed.inject(UserPermissionService).getCurrentUser()?.email).toBe(
        VIEWER.email
      );
    }));
  });

  describe('toolbar session identity', () => {
    it('shows the authenticated user and signs out', fakeAsync(() => {
      let loginDone = false;
      authService
        .login({ email: ADMIN.email, password: ADMIN.password })
        .subscribe(() => (loginDone = true));
      tick(500);

      expect(loginDone).toBeTrue();

      const fixture = TestBed.createComponent(ToolbarComponent);
      fixture.detectChanges();
      const native: HTMLElement = fixture.nativeElement;

      expect(native.textContent).toContain('Alice Administrator');
      expect(native.textContent).toContain(ADMIN.email);
      expect(native.querySelector('app-icon-logout')).toBeTruthy();

      fixture.componentInstance.logout();
      tick(50);

      expect(TestBed.inject(AuthSessionService).currentSession).toBeNull();
      expect(router.url).toBe('/auth/login');

      fixture.destroy();
    }));

    it('falls back to a neutral label when there is no session', () => {
      const fixture = TestBed.createComponent(ToolbarComponent);
      fixture.detectChanges();

      expect(fixture.componentInstance.userName).toBe('Unknown user');
      expect(fixture.componentInstance.email).toBe('');

      fixture.destroy();
    });
  });
});
