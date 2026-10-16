import { NgOptimizedImage } from "@angular/common";
import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterOutlet
  ],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {
  constructor() {
  }
}
