import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-icon-login',
  standalone: true,
  imports: [],
  templateUrl: './icon-login.component.html',
  styleUrl: './icon-login.component.scss'
})
export class IconLoginComponent {
  @Input() color: string = '#292D32';
  @Input() size: string = '24px';
}
