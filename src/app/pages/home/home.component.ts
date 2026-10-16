import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from "primeng/button";
import { Ripple } from "primeng/ripple";
import { UserPermissionService } from '../../services/user-permission.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ButtonDirective,
    Ripple,
    RouterLink,
    JsonPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  user: any;

  constructor(private userPermissionService: UserPermissionService) {
    this.user = this.userPermissionService.getCurrentUser();
  }
}
