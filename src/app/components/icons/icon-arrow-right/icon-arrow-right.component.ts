import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-arrow-right',
  standalone: true,
  imports: [],
  templateUrl: './icon-arrow-right.component.html',
  styleUrl: './icon-arrow-right.component.scss',
})
export class IconArrowRightComponent {
  @Input() color: string = '#0F4C5C';
  @Input() size: string = '24px';
}
