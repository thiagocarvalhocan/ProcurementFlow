import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-home-trend-up',
  standalone: true,
  imports: [],
  templateUrl: './icon-home-trend-up.component.html',
  styleUrl: './icon-home-trend-up.component.scss'
})
export class IconHomeTrendUpComponent {
  @Input() color: string = '#292D32';
  @Input() size: string = '24px';
}
