import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-arrow-left',
  standalone: true,
  imports: [],
  templateUrl: './icon-arrow-left.component.html',
  styleUrl: './icon-arrow-left.component.scss',
})
export class IconArrowLeftComponent {
  @Input() color: string = '#0F4C5C';
  @Input() size: string = '24px';
}
