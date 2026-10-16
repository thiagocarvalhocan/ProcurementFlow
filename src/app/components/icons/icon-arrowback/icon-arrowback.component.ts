import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-arrowback',
  standalone: true,
  imports: [],
  templateUrl: './icon-arrowback.component.html',
  styleUrl: './icon-arrowback.component.scss'
})
export class IconArrowbackComponent {
  @Input() color: string = '#000000';
  @Input() size: string = '16px';
}
