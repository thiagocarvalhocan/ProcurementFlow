import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-search-normal',
  standalone: true,
  imports: [],
  templateUrl: './icon-search-normal.component.html',
  styleUrl: './icon-search-normal.component.scss',
})
export class IconSearchNormalComponent {
  @Input() color: string = '#0F4C5C';
  @Input() size: string = '24px';
}
