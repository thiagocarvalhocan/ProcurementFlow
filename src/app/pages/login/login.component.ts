import { Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services/auth.service';
import { AuthLayoutContentComponent } from '../../components/auth-layout-content/auth-layout-content.component';
import { ButtonLoginComponent } from '../../components/button-login/button-login.component';
import {
  MOCK_ACCOUNTS,
  MOCK_DEFAULT_CREDENTIALS,
  MockAccount,
} from '../../core/auth/mock-auth-data';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    InputTextModule,
    AuthLayoutContentComponent,
    ButtonLoginComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  /** Accounts published by the offline fake API. */
  readonly accounts = MOCK_ACCOUNTS;
  readonly loginForm: FormGroup;

  loginInProgress = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.nonNullable.group({
      email: [
        MOCK_DEFAULT_CREDENTIALS.email,
        [Validators.required, Validators.email],
      ],
      password: ['', Validators.required],
    });
  }

  useAccount(account: MockAccount): void {
    this.loginForm.setValue({
      email: account.email,
      password: account.password,
    });
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.loginInProgress) return;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please inform a valid e-mail and password.';
      return;
    }

    this.loginInProgress = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => this.authService.goToHome(),
      error: (error: unknown) => {
        this.errorMessage =
          error instanceof Error ? error.message : 'Login failed. Try again.';
        this.loginInProgress = false;
      },
    });
  }
}


