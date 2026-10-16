import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-arrowright',
  standalone: true,
  imports: [],
  templateUrl: './icon-arrowright.component.html',
  styleUrl: './icon-arrowright.component.scss'
})
export class IconArrowrightComponent {
  @Input() color: string = '#000000';
  @Input() size: string = '16px';
}
