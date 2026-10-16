import { Injectable } from '@angular/core';
import { AuthenticatedUser } from '../core/auth/models/authenticated-user';
import { UserFeature } from '../core/auth/models/user-feature';

/**
 * Permission engine. It reads the authenticated user stored by the mock
 * authentication flow and answers feature/action questions used by the
 * sidebar, route guards and page buttons.
 */
@Injectable({
  providedIn: 'root',
})
export class UserPermissionService {
  private key = 'procurement-flow.user';

  getCurrentUser(): AuthenticatedUser | null {
    const user = localStorage.getItem(this.key);
    return user ? (JSON.parse(user) as AuthenticatedUser) : null;
  }

  setCurrentUser(user: AuthenticatedUser) {
    localStorage.setItem(this.key, JSON.stringify(user));
  }

  clearCurrentUser() {
    localStorage.removeItem(this.key);
  }

  hasFeature(feature: string): boolean {
    return this.findUserFeature(feature) !== undefined;
  }

  hasPermission(feature: string, action: string): boolean {
    const currentUserFeature = this.findUserFeature(feature);

    if (!currentUserFeature) return false;

    return (currentUserFeature.actions ?? []).some(
      (currentUserAction) => currentUserAction.code === action
    );
  }

  getMessageUserWithoutPermission(): string {
    const user = this.getCurrentUser();
    if (!user || !user.accessDeniedEmail) return '';

    return `You have no permission to access this feature. Please contact the system administrator to request access: ${user.accessDeniedEmail}`;
  }

  private findUserFeature(code: string): UserFeature | undefined {
    const user = this.getCurrentUser();

    if (!user?.features) return undefined;

    return user.features.find((userFeature) => userFeature.code === code);
  }
}

