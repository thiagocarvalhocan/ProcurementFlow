import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-process',
  standalone: true,
  imports: [],
  templateUrl: './icon-process.component.html',
  styleUrl: './icon-process.component.scss',
})
export class IconProcessComponent {
  @Input() color: string = 'currentColor';
  @Input() size: string = '24px';
}
