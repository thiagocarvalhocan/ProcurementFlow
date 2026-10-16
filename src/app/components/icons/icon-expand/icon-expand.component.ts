import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-expand',
  standalone: true,
  imports: [],
  templateUrl: './icon-expand.component.html',
  styleUrl: './icon-expand.component.scss',
})
export class IconExpandComponent {
  @Input() color: string = '#001E39';
  @Input() size: string = '24px';
  @Input() class = '';
}
