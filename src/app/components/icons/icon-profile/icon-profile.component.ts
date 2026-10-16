import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-profile',
  standalone: true,
  imports: [],
  templateUrl: './icon-profile.component.html',
  styleUrl: './icon-profile.component.scss',
})
export class IconProfileComponent {
  @Input() color: string = '#292D32';
  @Input() size: string = '24px';
}
