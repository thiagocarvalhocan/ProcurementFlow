import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { UserPermissionService } from '../services/user-permission.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class PermissionGuard implements CanActivate {

  constructor(private userPermissionService: UserPermissionService, private router: Router) {}
 
  canActivate(

    route: ActivatedRouteSnapshot,

  ): boolean {

    const featureCode = route.data['featureCode']; 
 
    if (this.userPermissionService.hasFeature(featureCode)) {
      return true; 

    } else {
        this.router.navigate(['/auth/no-permission']).then(() => console.log("Redirect to no-permission"));
        return false;
    }

  }

}