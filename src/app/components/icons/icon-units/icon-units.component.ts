import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-units',
  standalone: true,
  imports: [],
  templateUrl: './icon-units.component.html',
  styleUrl: './icon-units.component.scss',
})
export class IconUnitsComponent {
  @Input() color: string = 'currentColor';
  @Input() size: string = '16px';
}
