import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-clone',
  standalone: true,
  imports: [],
  templateUrl: './icon-clone.component.html',
  styleUrl: './icon-clone.component.scss',
})
export class IconCloneComponent {
  @Input() color: string = 'currentColor';
  @Input() size: string = '24px';
}
