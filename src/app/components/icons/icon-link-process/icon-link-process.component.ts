import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-link-process',
  standalone: true,
  imports: [],
  templateUrl: './icon-link-process.component.html',
  styleUrl: './icon-link-process.component.scss',
})
export class IconLinkProcessComponent {
  @Input() color: string = 'currentColor';
  @Input() size: string = '24px';
}
