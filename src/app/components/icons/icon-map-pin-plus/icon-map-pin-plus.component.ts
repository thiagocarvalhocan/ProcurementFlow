import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-map-pin-plus',
  standalone: true,
  imports: [],
  templateUrl: './icon-map-pin-plus.component.html',
  styleUrl: './icon-map-pin-plus.component.scss'
})
export class IconMapPinPlusComponent {
  @Input() color: string = 'currentColor';
  @Input() size: string = '16px';
}
