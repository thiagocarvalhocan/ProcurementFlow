import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-view-alert',
  standalone: true,
  imports: [],
  templateUrl: './icon-view-alert.component.html',
  styleUrl: './icon-view-alert.component.scss',
})
export class IconViewAlertComponent {
  @Input() color: string = 'currentColor';
  @Input() size: string = '24px';
}
