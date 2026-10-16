import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-tick-circle',
  standalone: true,
  imports: [],
  templateUrl: './icon-tick-circle.component.html',
  styleUrl: './icon-tick-circle.component.scss',
})
export class IconTickCircleComponent {
  @Input() color: string = '#0F4C5C';
  @Input() size: string = '24px';
}
