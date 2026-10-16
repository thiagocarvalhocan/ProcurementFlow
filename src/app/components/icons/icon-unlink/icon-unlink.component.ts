import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-unlink',
  standalone: true,
  imports: [],
  templateUrl: './icon-unlink.component.html',
  styleUrl: './icon-unlink.component.scss',
})
export class IconUnlinkComponent {
  @Input() color: string = 'currentColor';
  @Input() size: string = '24px';
}
