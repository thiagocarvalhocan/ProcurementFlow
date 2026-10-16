import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UserPermissionService } from '../../services/user-permission.service';

@Component({
  selector: 'app-no-permission',
  standalone: true,
  imports: [ButtonModule, NgOptimizedImage, CommonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './no-permission.component.html',
  styleUrl: './no-permission.component.scss',
})
export class NoPermissionComponent implements OnInit {
  message: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private userPermissionService: UserPermissionService
  ) {
    this.userService.authenticated().subscribe({
      next: (response) => {
        if (!response) {
          this.authService.logout();
          this.router.navigate(['/auth/login']).then((r) => {});
        } else {
          this.userPermissionService.setCurrentUser(response);
        }
      },
      error: (response) => {
        this.authService.logout();
        this.router.navigate(['/auth/login']).then((r) => {});
      },
    });
  }

  ngOnInit(): void {
    this.prepareMessage();
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']).then((r) => {});
    }
  }

  onGoHome() {
    this.router.navigate(['/']).then((r) => {});
  }

  onLogout() {
    this.authService.logout();
  }

  prepareMessage() {
    const url = this.router.url;
    switch (url) {
      case '/auth/no-permission':
        this.message =
          this.userPermissionService.getMessageUserWithoutPermission();
        break;
      case '/auth/no-access':
        this.message =
          'The user has no access. Please ask the system administrator for access!';
        break;
      case '/auth/disabled-user':
        this.message =
          'The user is disabled in the User Management feature. Please ask the responsible person to enable it!';
        break;
      default:
        this.message =
          'The user has no access. Please ask the system administrator for access!';
        break;
    }
  }
}
