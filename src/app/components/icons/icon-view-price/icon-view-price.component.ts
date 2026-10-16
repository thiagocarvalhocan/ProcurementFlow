import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-view-price',
  standalone: true,
  imports: [],
  templateUrl: './icon-view-price.component.html',
  styleUrl: './icon-view-price.component.scss',
})
export class IconViewPriceComponent {
  @Input() color: string = 'currentColor';
  @Input() size: string = '24px';
}
