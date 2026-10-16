import { Component } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AuthService } from '../../services/auth.service';
import { AuthLayoutContentComponent } from '../../components/auth-layout-content/auth-layout-content.component';

@Component({
  selector: 'app-redirect-callback',
  standalone: true,
  imports: [AuthLayoutContentComponent, ButtonDirective, Ripple],
  templateUrl: './redirect-callback.component.html',
  styleUrl: './redirect-callback.component.scss',
})
export class RedirectCallbackComponent {
  constructor(private authService: AuthService) {
    // The old OAuth callback entry point now only restores a local session.
    this.authService.restoreSession()
      ? this.authService.goToHome()
      : this.authService.goToLogin();
  }
}

