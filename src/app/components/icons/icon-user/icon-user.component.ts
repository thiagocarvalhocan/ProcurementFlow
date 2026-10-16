import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-user',
  standalone: true,
  imports: [],
  templateUrl: './icon-user.component.html',
  styleUrl: './icon-user.component.scss',
})
export class IconUserComponent {
  @Input() color: string = '#292D32';
  @Input() size: string = '24px';
}
