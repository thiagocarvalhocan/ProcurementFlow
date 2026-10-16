import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-clean',
  standalone: true,
  imports: [],
  templateUrl: './icon-clean.component.html',
  styleUrl: './icon-clean.component.scss',
})
export class IconCleanComponent {
  @Input() color: string = '#0F4C5C';
  @Input() size: string = '24px';
}
