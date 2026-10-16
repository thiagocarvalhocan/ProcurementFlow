import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-graphic',
  standalone: true,
  imports: [],
  templateUrl: './icon-graphic.component.html',
  styleUrl: './icon-graphic.component.scss'
})
export class IconGraphicComponent {
  @Input() color: string = '#858796';
  @Input() size: string = '125px';
}
