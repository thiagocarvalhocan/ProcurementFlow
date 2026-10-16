import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-message',
  standalone: true,
  imports: [],
  templateUrl: './icon-message.component.html',
  styleUrl: './icon-message.component.scss',
})
export class IconMessageComponent {
  @Input() color: string = 'currentColor';
  @Input() size: string = 'currentSize';
}
