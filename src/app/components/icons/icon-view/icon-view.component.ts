import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-view',
  standalone: true,
  imports: [],
  templateUrl: './icon-view.component.html',
  styleUrl: './icon-view.component.scss'
})
export class IconViewComponent {
  @Input() color: string = '#5A4007';
  @Input() size: string = '24px';
}
