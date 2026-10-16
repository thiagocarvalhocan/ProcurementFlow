import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-icon-logout',
  standalone: true,
  imports: [],
  templateUrl: './icon-logout.component.html',
  styleUrl: './icon-logout.component.scss'
})
export class IconLogoutComponent {
  @Input() color: string = '#292D32';
  @Input() size: string = '24px';
}
