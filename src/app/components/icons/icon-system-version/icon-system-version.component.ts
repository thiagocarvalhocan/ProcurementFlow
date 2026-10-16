import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-system-version',
  standalone: true,
  imports: [],
  templateUrl: './icon-system-version.component.html',
  styleUrl: './icon-system-version.component.scss',
})
export class IconSystemVersionComponent {
  @Input() color: string = '#292D32';
  @Input() size: string = '24px';
}
