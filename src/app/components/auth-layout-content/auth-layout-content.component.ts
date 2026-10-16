import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-auth-layout-content',
  standalone: true,
  imports: [],
  templateUrl: './auth-layout-content.component.html',
  styleUrl: './auth-layout-content.component.scss'
})
export class AuthLayoutContentComponent {
  @Input() title: string | undefined;
  @Input() description: string | undefined;
}
