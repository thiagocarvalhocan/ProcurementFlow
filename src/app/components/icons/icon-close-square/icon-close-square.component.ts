import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-close-square',
  standalone: true,
  imports: [],
  templateUrl: './icon-close-square.component.html',
  styleUrl: './icon-close-square.component.scss'
})
export class IconCloseSquareComponent {
  @Input() color: string = '#494949';
  @Input() size: string = '24px';
}
